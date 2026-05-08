import axios from 'axios';
import { BACKEND_CONFIG, MESSAGES } from '../utils/constants';
import { cacheService } from './cacheService';

const api = axios.create({
  baseURL: BACKEND_CONFIG.BASE_URL + BACKEND_CONFIG.API_PREFIX,
  timeout: BACKEND_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

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

/**
 * Build valorant-api.com CDN URLs from a card UUID.
 * The same CDN is what Henrik returns anyway, but we derive them from the
 * UUID so we can reconstruct them even when the Henrik response is unavailable.
 */
const buildCardUrls = (uuid) => ({
  small: `https://media.valorant-api.com/playercards/${uuid}/smallart.png`,
  large: `https://media.valorant-api.com/playercards/${uuid}/largeart.png`,
  wide:  `https://media.valorant-api.com/playercards/${uuid}/wideart.png`,
  id:    uuid,
});

export const valorantAPI = {

  /**
   * Lightweight: account + MMR for PlayerGrid cards.
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
   * Full profile data for PlayerProfilePage.
   * Returns { status, playerData, mmr, matches, mmrHistory, stats }
   */
  async getPlayerProfile(name, tag, region = 'latam') {
    try {
      const response = await api.get(`/profile/${region}/${enc(name)}/${enc(tag)}`);
      return response.data;
    } catch (error) {
      console.error(`Error loading profile ${name}#${tag}:`, error.message);
      return { status: 'error', message: error.message };
    }
  },

  /**
   * Fetch all players with stale-while-revalidate caching.
   *
   * Cache strategy:
   *  • 0–6h:  fresh — serve from localStorage, 0 Henrik calls
   *  • 6–24h: stale — serve cached immediately, refresh in background
   *  • >24h:  hard miss — synchronous fresh fetch (24 Henrik calls)
   */
  async getPlayersDataWithCache(players, forceRefresh = false) {
    if (!forceRefresh) {
      const cached = cacheService.getPlayersData();

      if (cached && !cached.isStale) {
        console.log(`[API] Cache fresh (${Math.round(cached.age / 1000 / 60)}min) — 0 Henrik calls`);
        return { data: cached.data, fromCache: true, age: cached.age };
      }

      if (cached && cached.isStale) {
        console.log('[API] Cache stale — serving immediately, refreshing in background');
        this.updateCacheInBackground(players);
        return { data: cached.data, fromCache: true, age: cached.age, isStale: true };
      }
    }

    console.log('[API] Cache miss — fetching from Henrik (sequential)');
    return this.fetchFreshPlayersData(players);
  },

  /**
   * Sequential fetch — one player at a time to respect the 30 req/min limit.
   * Each player = 2 Henrik calls (account + MMR) via the /complete endpoint.
   *
   * Card images are served from valorant-api.com CDN using the card UUID.
   * The UUID is cached separately for 7 days so card images survive the 24h
   * player data expiry without requiring additional Henrik calls.
   */
  async fetchFreshPlayersData(players) {
    const results = [];

    for (const player of players) {
      try {
        console.log(`[API] Fetching ${player.name}#${player.tag}`);
        const completeData = await this.getPlayerComplete(player.name, player.tag, player.region);

        if (!completeData.success || !completeData.player?.data) {
          throw new Error(completeData.error || 'No se pudieron obtener los datos del jugador');
        }

        const accountData = completeData.player.data;

        // Enrich card with valorant-api.com CDN URLs derived from UUID
        if (accountData.card?.id) {
          accountData.card = {
            ...accountData.card,
            ...buildCardUrls(accountData.card.id),
          };
          // Cache card UUID for 7 days — lets us show card images even when
          // the 24h player cache is stale, without extra Henrik calls
          cacheService.saveCardData(
            `${player.name}#${player.tag}`,
            buildCardUrls(accountData.card.id)
          );
        }

        results.push({
          ...player,
          playerData:  accountData,
          mmrData:     completeData.mmr?.data?.[0] || null,
          peakData:    completeData.peak || null,
          isLoading:   false,
          error:       null,
          lastUpdated: Date.now(),
        });
      } catch (playerError) {
        console.error(`[API] Error for ${player.name}#${player.tag}:`, playerError.message);

        // Recover card from long-lived cache so the card renders even on error
        const cachedCard = cacheService.getCardData(`${player.name}#${player.tag}`);

        results.push({
          ...player,
          playerData: cachedCard
            ? { name: player.name, tag: player.tag, account_level: null, card: cachedCard }
            : null,
          mmrData:    null,
          peakData:   null,
          isLoading:  false,
          error:      playerError.message,
          lastUpdated: Date.now(),
        });
      }
    }

    cacheService.savePlayersData(results);
    console.log(`[API] Saved ${results.length} players to 24h cache`);
    return { data: results, fromCache: false, age: 0 };
  },

  async updateCacheInBackground(players) {
    try {
      await this.fetchFreshPlayersData(players);
      window.dispatchEvent(new CustomEvent('cacheUpdated', { detail: { timestamp: Date.now() } }));
    } catch (error) {
      console.error('[API] Background cache update failed:', error.message);
    }
  },

  /**
   * Refresh a single player's data and update their entry in the grid cache.
   * Called when the user opens a player's profile card.
   */
  async refreshSinglePlayer(name, tag, region = 'latam') {
    try {
      const completeData = await this.getPlayerComplete(name, tag, region);
      if (!completeData.success || !completeData.player?.data) return null;

      const accountData = completeData.player.data;
      if (accountData.card?.id) {
        accountData.card = { ...accountData.card, ...buildCardUrls(accountData.card.id) };
        cacheService.saveCardData(`${name}#${tag}`, buildCardUrls(accountData.card.id));
      }

      const fresh = {
        playerData: accountData,
        mmrData:    completeData.mmr?.data?.[0] || null,
        peakData:   completeData.peak || null,
        error:      null,
      };

      cacheService.updatePlayerInCache(name, tag, fresh);
      return fresh;
    } catch (error) {
      console.error(`[API] refreshSinglePlayer failed for ${name}#${tag}:`, error.message);
      return null;
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

  async getMMRDetailed(name, tag, region = 'latam') {
    try {
      const response = await api.get(`/mmr-detailed/${region}/${enc(name)}/${enc(tag)}`);
      return response.data;
    } catch (error) {
      console.error(`Error MMR detallado para ${name}#${tag}:`, error.message);
      return { status: 'error', data: null };
    }
  },

  async getStoredMMR(name, tag, region = 'latam') {
    try {
      const response = await api.get(`/stored-mmr/${region}/${enc(name)}/${enc(tag)}`);
      return response.data;
    } catch (error) {
      console.error(`Error stored MMR para ${name}#${tag}:`, error.message);
      return { status: 'error', data: [] };
    }
  },

  async getMatchHistory(name, tag, region = 'latam', size = 15, start = 0) {
    try {
      const response = await api.get(
        `/match-history/${region}/${enc(name)}/${enc(tag)}?size=${size}&start=${start}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error historial para ${name}#${tag}:`, error.message);
      return { status: 'error', matches: [], mmrHistory: [] };
    }
  },

  async getLeaderboard() {
    try {
      const response = await api.get('/leaderboard');
      return response.data;
    } catch (error) {
      console.error('Error leaderboard:', error.message);
      return { status: 'error', players: [] };
    }
  },
};

export default valorantAPI;
