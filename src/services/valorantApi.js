import axios from 'axios';
import { BACKEND_CONFIG, MESSAGES } from '../utils/constants';
import { cacheService } from './cacheService';

const api = axios.create({
  baseURL: BACKEND_CONFIG.BASE_URL + BACKEND_CONFIG.API_PREFIX,
  timeout: BACKEND_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') throw new Error(MESSAGES.SERVER_ERROR);
    if (error.response?.status === 500)  throw new Error('Error interno del servidor');
    if (error.response?.status === 404)  throw new Error('Jugador no encontrado');
    if (error.response?.status === 429)  throw new Error('Demasiadas solicitudes. Espera un momento antes de reintentar.');
    return Promise.reject(error);
  }
);

const enc = (s) => encodeURIComponent(s);

export const valorantAPI = {
  /**
   * Complete player data for the profile page.
   * Uses the consolidated /profile/ endpoint — 3 Henrik API calls total.
   * Returns { status, playerData, mmr, matches, mmrHistory, stats }
   */
  async getPlayerProfile(name, tag, region = 'latam') {
    try {
      const response = await api.get(`/profile/${region}/${enc(name)}/${enc(tag)}`);
      return response.data;
    } catch (error) {
      console.error(`Error cargando perfil ${name}#${tag}:`, error.message);
      return { status: 'error', message: error.message };
    }
  },

  /**
   * Lightweight complete data for the PlayerGrid (integrantes page).
   * Returns { success, player, mmr, peak }
   */
  async getPlayerComplete(name, tag, region = 'latam') {
    try {
      const response = await api.get(`/complete/${region}/${enc(name)}/${enc(tag)}`);
      return response.data;
    } catch (error) {
      throw new Error(`${MESSAGES.PLAYER_ERROR}: ${name}#${tag} - ${error.message}`);
    }
  },

  /**
   * Fetch all players data with stale-while-revalidate caching.
   */
  async getPlayersDataWithCache(players, forceRefresh = false) {
    if (!forceRefresh) {
      const cachedResult = cacheService.getPlayersData();

      if (cachedResult && !cachedResult.isStale) {
        return { data: cachedResult.data, fromCache: true, age: cachedResult.age };
      }
      if (cachedResult && cachedResult.isStale) {
        this.updateCacheInBackground(players);
        return { data: cachedResult.data, fromCache: true, age: cachedResult.age, isStale: true };
      }
    }
    return this.fetchFreshPlayersData(players);
  },

  async fetchFreshPlayersData(players) {
    /* Sequential — avoids saturating the 30 req/min Henrik rate limit.
       Each iteration fires 2 parallel calls (account + MMR) for one player. */
    const results = [];
    for (const player of players) {
      try {
        const completeData = await this.getPlayerComplete(player.name, player.tag, player.region);

        if (!completeData.success || !completeData.player?.data) {
          throw new Error(completeData.error || 'No se pudieron obtener los datos del jugador');
        }

        results.push({
          ...player,
          playerData:  completeData.player.data,
          mmrData:     completeData.mmr.data?.[0] || null,
          peakData:    completeData.peak || null,
          isLoading:   false,
          error:       null,
          lastUpdated: Date.now(),
        });
      } catch (playerError) {
        console.error(`Error para ${player.name}#${player.tag}:`, playerError.message);
        results.push({
          ...player,
          playerData:  null,
          mmrData:     null,
          peakData:    null,
          isLoading:   false,
          error:       playerError.message,
          lastUpdated: Date.now(),
        });
      }
    }

    cacheService.savePlayersData(results);
    return { data: results, fromCache: false, age: 0 };
  },

  async updateCacheInBackground(players) {
    try {
      await this.fetchFreshPlayersData(players);
      window.dispatchEvent(new CustomEvent('cacheUpdated', { detail: { timestamp: Date.now() } }));
    } catch (error) {
      console.error('Error actualizando cache en segundo plano:', error.message);
    }
  },

  async getPlayerBasic(name, tag) {
    try {
      const response = await api.get(`/player/${enc(name)}/${enc(tag)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo datos basicos para ${name}#${tag}: ${error.message}`);
    }
  },

  async getPlayerMMR(name, tag, region = 'latam') {
    try {
      const response = await api.get(`/mmr/${region}/${enc(name)}/${enc(tag)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo MMR para ${name}#${tag}: ${error.message}`);
    }
  },

  /**
   * MMR v3 — detailed MMR with peak rank, seasonal breakdown, shields.
   * Returns { status, data: { currentTier, currentRR, elo, peakTier, peakSeason, seasonal[], ... } }
   */
  async getMMRDetailed(name, tag, region = 'latam') {
    try {
      const response = await api.get(`/mmr-detailed/${region}/${enc(name)}/${enc(tag)}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo MMR detallado para ${name}#${tag}:`, error.message);
      return { status: 'error', data: null };
    }
  },

  /**
   * Stored MMR history — historical data beyond last ~10 matches.
   */
  async getStoredMMR(name, tag, region = 'latam') {
    try {
      const response = await api.get(`/stored-mmr/${region}/${enc(name)}/${enc(tag)}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo stored MMR para ${name}#${tag}:`, error.message);
      return { status: 'error', data: [] };
    }
  },

  async checkServerHealth() {
    try {
      const response = await axios.get(BACKEND_CONFIG.BASE_URL + BACKEND_CONFIG.HEALTH_ENDPOINT);
      return response.data;
    } catch {
      return { status: 'ERROR', message: 'Servidor no disponible', timestamp: new Date().toISOString() };
    }
  },

  /**
   * Aggregated player stats — top agents, KDA, win rate, HS%, per-map stats.
   */
  async getPlayerStats(name, tag, region = 'latam') {
    try {
      const response = await api.get(`/player-stats/${region}/${enc(name)}/${enc(tag)}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo stats para ${name}#${tag}:`, error.message);
      return { status: 'error', stats: null };
    }
  },

  /**
   * Match history + MMR progression (v4 matches with pagination).
   */
  async getMatchHistory(name, tag, region = 'latam', size = 15, start = 0) {
    try {
      const response = await api.get(
        `/match-history/${region}/${enc(name)}/${enc(tag)}?size=${size}&start=${start}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo historial para ${name}#${tag}:`, error.message);
      return { status: 'error', matches: [], mmrHistory: [] };
    }
  },

  /**
   * Clan leaderboard — all players with peak rank data.
   */
  async getLeaderboard() {
    try {
      const response = await api.get('/leaderboard');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo leaderboard:', error.message);
      return { status: 'error', players: [] };
    }
  },
};

export default valorantAPI;
