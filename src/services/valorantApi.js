import axios from 'axios';
import { BACKEND_CONFIG, MESSAGES } from '../utils/constants';
import { cacheService } from './cacheService';

const api = axios.create({
  baseURL: BACKEND_CONFIG.BASE_URL + BACKEND_CONFIG.API_PREFIX,
  timeout: BACKEND_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      throw new Error(MESSAGES.SERVER_ERROR);
    }
    if (error.response?.status === 500) {
      throw new Error('Error interno del servidor');
    }
    if (error.response?.status === 404) {
      throw new Error('Jugador no encontrado');
    }
    if (error.response?.status === 429) {
      throw new Error('Demasiadas solicitudes. Espera un momento antes de reintentar.');
    }
    return Promise.reject(error);
  }
);

export const valorantAPI = {
  async getPlayerComplete(name, tag, region = 'latam') {
    try {
      const encodedName = encodeURIComponent(name);
      const encodedTag = encodeURIComponent(tag);
      const response = await api.get(`/complete/${region}/${encodedName}/${encodedTag}`);
      return response.data;
    } catch (error) {
      throw new Error(`${MESSAGES.PLAYER_ERROR}: ${name}#${tag} - ${error.message}`);
    }
  },

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
    const playerPromises = players.map(async (player) => {
      try {
        const completeData = await this.getPlayerComplete(player.name, player.tag, player.region);

        if (!completeData.success) {
          throw new Error('No se pudieron obtener los datos completos');
        }

        return {
          ...player,
          playerData: completeData.player.data,
          mmrData: completeData.mmr.data?.[0] || null,
          isLoading: false,
          error: null,
          lastUpdated: Date.now()
        };
      } catch (playerError) {
        console.error(`Error para ${player.name}#${player.tag}:`, playerError.message);
        return {
          ...player,
          playerData: null,
          mmrData: null,
          isLoading: false,
          error: playerError.message,
          lastUpdated: Date.now()
        };
      }
    });

    const results = await Promise.all(playerPromises);
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
      const response = await api.get(`/player/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo datos basicos para ${name}#${tag}: ${error.message}`);
    }
  },

  async getPlayerMMR(name, tag, region = 'latam') {
    try {
      const response = await api.get(`/mmr/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo MMR para ${name}#${tag}: ${error.message}`);
    }
  },

  async checkServerHealth() {
    try {
      const response = await axios.get(BACKEND_CONFIG.BASE_URL + BACKEND_CONFIG.HEALTH_ENDPOINT);
      return response.data;
    } catch (error) {
      return {
        status: 'ERROR',
        message: 'Servidor no disponible',
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Fetch aggregated player stats (top agents, KDA, win rate, etc.)
   * from recent competitive matches.
   */
  async getPlayerStats(name, tag, region = 'latam') {
    try {
      const response = await api.get(
        `/player-stats/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo stats para ${name}#${tag}:`, error.message);
      return { status: 'error', stats: null };
    }
  },

  /**
   * Fetch match history + MMR history for the player profile page.
   * Returns individual match details and ELO progression data.
   */
  async getMatchHistory(name, tag, region = 'latam', size = 15) {
    try {
      const response = await api.get(
        `/match-history/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo historial para ${name}#${tag}:`, error.message);
      return { status: 'error', matches: [], mmrHistory: [] };
    }
  },

  /**
   * Fetch clan leaderboard data (all players with stats).
   */
  async getLeaderboard() {
    try {
      const response = await api.get('/leaderboard');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo leaderboard:', error.message);
      return { status: 'error', players: [] };
    }
  }
};

export default valorantAPI;
