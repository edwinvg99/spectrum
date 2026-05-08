import { CACHE_CONFIG } from '../utils/constants';

const CACHE_KEYS = {
  PLAYERS_DATA:  'valorant_players_cache',
  CACHE_METADATA:'valorant_cache_metadata',
  CARD_PREFIX:   'vsc_card_',
  GENERIC_PREFIX:'vsc_',
};

/* safe localStorage wrappers */
const ls = {
  get:    (k)    => { try { return localStorage.getItem(k); }        catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }            catch {} },
  remove: (k)    => { try { localStorage.removeItem(k); }            catch {} },
  keys:   ()     => { try { return Object.keys(localStorage); }      catch { return []; } },
};

export const cacheService = {

  // ── Generic key/value cache (used for card UUIDs, etc.) ──────────────────

  set(key, data, ttl) {
    const entry = {
      data,
      timestamp: Date.now(),
      ttl,
      version: CACHE_CONFIG.VERSION,
    };
    ls.set(CACHE_KEYS.GENERIC_PREFIX + key, JSON.stringify(entry));
  },

  get(key) {
    const raw = ls.get(CACHE_KEYS.GENERIC_PREFIX + key);
    if (!raw) return null;
    let entry;
    try { entry = JSON.parse(raw); } catch { ls.remove(CACHE_KEYS.GENERIC_PREFIX + key); return null; }
    if (entry.version !== CACHE_CONFIG.VERSION) { ls.remove(CACHE_KEYS.GENERIC_PREFIX + key); return null; }
    if (Date.now() - entry.timestamp > entry.ttl) { ls.remove(CACHE_KEYS.GENERIC_PREFIX + key); return null; }
    return entry.data;
  },

  // ── Player card UUID cache (7-day TTL) ────────────────────────────────────

  saveCardData(playerKey, cardData) {
    this.set(CACHE_KEYS.CARD_PREFIX + playerKey, cardData, CACHE_CONFIG.PLAYER_CARD_TTL);
  },

  getCardData(playerKey) {
    return this.get(CACHE_KEYS.CARD_PREFIX + playerKey);
  },

  // ── Player grid cache (24h TTL) ───────────────────────────────────────────

  savePlayersData(playersData) {
    try {
      const cacheData = {
        data:      playersData,
        timestamp: Date.now(),
        version:   CACHE_CONFIG.VERSION,
      };
      ls.set(CACHE_KEYS.PLAYERS_DATA, JSON.stringify(cacheData));
      ls.set(CACHE_KEYS.CACHE_METADATA, JSON.stringify({
        lastUpdate:   Date.now(),
        playersCount: playersData.length,
        version:      CACHE_CONFIG.VERSION,
      }));
      console.log(`[Cache] Saved ${playersData.length} players (24h TTL)`);
      return true;
    } catch (error) {
      console.error('[Cache] Error saving players data:', error);
      return false;
    }
  },

  /** Update a single player's entry in the cached array without re-fetching all. */
  updatePlayerInCache(name, tag, fresh) {
    const cached = this.getPlayersData();
    if (!cached) return false;
    const updated = cached.data.map((p) =>
      p.name === name && p.tag === tag ? { ...p, ...fresh, lastUpdated: Date.now() } : p
    );
    this.savePlayersData(updated);
    return true;
  },

  getPlayersData() {
    try {
      const raw = ls.get(CACHE_KEYS.PLAYERS_DATA);
      if (!raw) return null;

      const parsed = JSON.parse(raw);

      if (parsed.version !== CACHE_CONFIG.VERSION) {
        console.log('[Cache] Version mismatch — clearing');
        this.clearCache();
        return null;
      }

      const age = Date.now() - parsed.timestamp;
      if (age > CACHE_CONFIG.MAX_AGE) {
        console.log('[Cache] Hard-expired — clearing');
        this.clearCache();
        return null;
      }

      console.log(`[Cache] Hit — ${Math.round(age / 1000 / 60)}min old, stale=${age > CACHE_CONFIG.TTL}`);
      return { data: parsed.data, age, isStale: age > CACHE_CONFIG.TTL };
    } catch (error) {
      console.error('[Cache] Read error:', error);
      this.clearCache();
      return null;
    }
  },

  isCacheFresh() {
    const c = this.getPlayersData();
    return !!(c && !c.isStale);
  },

  clearCache() {
    ls.remove(CACHE_KEYS.PLAYERS_DATA);
    ls.remove(CACHE_KEYS.CACHE_METADATA);
  },

  clearAll() {
    this.clearCache();
    ls.keys().filter(k => k.startsWith(CACHE_KEYS.GENERIC_PREFIX)).forEach(k => ls.remove(k));
    console.log('[Cache] All entries cleared.');
  },

  getCacheMetadata() {
    try {
      const raw = ls.get(CACHE_KEYS.CACHE_METADATA);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  getCacheStatus() {
    const cached   = this.getPlayersData();
    const metadata = this.getCacheMetadata();

    if (!cached || !metadata) {
      return { hasCache: false, age: 0, isStale: true, nextUpdateIn: 0 };
    }

    const age = cached.age;
    return {
      hasCache:     true,
      age,
      isStale:      cached.isStale,
      nextUpdateIn: Math.max(0, CACHE_CONFIG.TTL - age),
      lastUpdate:   new Date(metadata.lastUpdate).toLocaleString('es-CO'),
      playersCount: metadata.playersCount,
    };
  },

  getConfig() { return CACHE_CONFIG; },

  isLocalStorageAvailable() {
    try {
      const k = '__cache_test__';
      localStorage.setItem(k, k);
      localStorage.removeItem(k);
      return true;
    } catch { return false; }
  },
};

export default cacheService;
