/**
 * cacheService — localStorage-backed cache for the Spectrum app.
 *
 * TTL strategy (configured in src/utils/constants.js):
 *  • Static game data (agents, maps, weapons): 1 h — changes only on patches
 *  • Semi-static (store, news):                15 min
 *  • Player data (MMR, match history):         10 min stale / 30 min max
 *
 * Stale-while-revalidate:
 *  • get() returns { data, age, isStale }
 *  • isStale === true → use the data now, refresh in background
 *
 * Version invalidation:
 *  • Bumping CACHE_CONFIG.VERSION wipes all entries on next access.
 */

import { CACHE_CONFIG } from '../utils/constants';

const GENERIC_PREFIX   = 'vsc_';
const PLAYERS_KEY      = 'valorant_players_cache';
const PLAYERS_META_KEY = 'valorant_cache_metadata';

/* ── safe localStorage wrappers (some browsers block it) ── */
const ls = {
  get:    (k)    => { try { return localStorage.getItem(k); }        catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }            catch {} },
  remove: (k)    => { try { localStorage.removeItem(k); }            catch {} },
  keys:   ()     => { try { return Object.keys(localStorage); }      catch { return []; } },
};

export const cacheService = {

  // ══════════════════════════════════════════════════════════════════════════
  // GENERIC CACHE  (key-based, any JSON data)
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Save data to cache.
   * @param {string} key      - Logical cache key (prefix added internally)
   * @param {*}      data     - JSON-serialisable payload
   * @param {number} ttl      - Hard TTL in ms (entry deleted after this)
   * @param {number} [stale]  - Stale threshold in ms (<= ttl). Defaults to 60% of ttl.
   */
  set(key, data, ttl, stale) {
    const entry = {
      data,
      timestamp: Date.now(),
      ttl,
      stale:   stale ?? Math.round(ttl * 0.6),
      version: CACHE_CONFIG.VERSION,
    };
    ls.set(GENERIC_PREFIX + key, JSON.stringify(entry));
  },

  /**
   * Retrieve cached data if it hasn't hard-expired.
   * @returns {{ data: *, age: number, isStale: boolean } | null}
   *   null    → miss or expired   → caller must fetch fresh data
   *   object  → hit; isStale true → use immediately and refresh soon
   */
  get(key) {
    const raw = ls.get(GENERIC_PREFIX + key);
    if (!raw) return null;

    let entry;
    try { entry = JSON.parse(raw); } catch { ls.remove(GENERIC_PREFIX + key); return null; }

    // Version mismatch → invalidate
    if (entry.version !== CACHE_CONFIG.VERSION) {
      ls.remove(GENERIC_PREFIX + key);
      return null;
    }

    const age = Date.now() - entry.timestamp;

    // Hard expired
    if (age > entry.ttl) {
      ls.remove(GENERIC_PREFIX + key);
      return null;
    }

    return { data: entry.data, age, isStale: age > entry.stale };
  },

  /** Delete a specific generic entry. */
  remove(key) {
    ls.remove(GENERIC_PREFIX + key);
  },

  /**
   * Stale-while-revalidate helper.
   *
   * Returns stale data immediately (if available) and refreshes in the
   * background. onFresh(newData) is called once the fresh data arrives.
   *
   * @param {string}   key      - Cache key
   * @param {Function} fetchFn  - Async function that returns the new data
   * @param {number}   ttl      - Hard TTL for fresh data
   * @param {Function} [onFresh]- Called with new data when background refresh completes
   * @returns {{ data: *, age: number, isStale: boolean } | null}
   */
  async getOrRevalidate(key, fetchFn, ttl, onFresh) {
    const cached = this.get(key);

    if (cached && !cached.isStale) return cached;   // ← fresh hit, done

    if (cached && cached.isStale) {
      // Return stale data to the component right away
      this._revalidateInBackground(key, fetchFn, ttl, onFresh);
      return cached;
    }

    // Full miss — fetch synchronously
    try {
      const fresh = await fetchFn();
      this.set(key, fresh, ttl);
      return { data: fresh, age: 0, isStale: false };
    } catch {
      return null;
    }
  },

  /** @private */
  async _revalidateInBackground(key, fetchFn, ttl, onFresh) {
    try {
      const fresh = await fetchFn();
      this.set(key, fresh, ttl);
      onFresh?.(fresh);
    } catch (e) {
      console.warn(`[Cache] Background revalidation failed for "${key}":`, e?.message);
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PLAYER-SPECIFIC CACHE  (used by usePlayerData hook)
  // ══════════════════════════════════════════════════════════════════════════

  savePlayersData(playersData) {
    ls.set(PLAYERS_KEY, JSON.stringify({
      data:      playersData,
      timestamp: Date.now(),
      version:   CACHE_CONFIG.VERSION,
    }));
    ls.set(PLAYERS_META_KEY, JSON.stringify({
      lastUpdate:   Date.now(),
      playersCount: playersData.length,
      version:      CACHE_CONFIG.VERSION,
    }));
  },

  getPlayersData() {
    const raw = ls.get(PLAYERS_KEY);
    if (!raw) return null;

    let parsed;
    try { parsed = JSON.parse(raw); } catch { this.clearCache(); return null; }

    if (parsed.version !== CACHE_CONFIG.VERSION) { this.clearCache(); return null; }

    const age = Date.now() - parsed.timestamp;
    if (age > CACHE_CONFIG.MAX_AGE) { this.clearCache(); return null; }

    return { data: parsed.data, age, isStale: age > CACHE_CONFIG.TTL };
  },

  clearCache() {
    ls.remove(PLAYERS_KEY);
    ls.remove(PLAYERS_META_KEY);
  },

  // ══════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ══════════════════════════════════════════════════════════════════════════

  /** Wipe ALL cache entries (generic + player). */
  clearAll() {
    this.clearCache();
    ls.keys().filter(k => k.startsWith(GENERIC_PREFIX)).forEach(k => ls.remove(k));
    console.log('[Cache] All entries cleared.');
  },

  /** Returns a human-readable snapshot of cached keys for debugging. */
  getDebugInfo() {
    const generic = ls.keys()
      .filter(k => k.startsWith(GENERIC_PREFIX))
      .map(k => {
        const raw = ls.get(k);
        if (!raw) return null;
        try {
          const e   = JSON.parse(raw);
          const age = Date.now() - e.timestamp;
          return {
            key:     k.replace(GENERIC_PREFIX, ''),
            age:     `${Math.round(age / 1000)}s`,
            ttl:     `${Math.round(e.ttl / 1000)}s`,
            isStale: age > e.stale,
            expired: age > e.ttl,
          };
        } catch { return null; }
      })
      .filter(Boolean);

    const players = this.getPlayersData();
    return {
      generic,
      players: players
        ? { age: `${Math.round(players.age / 1000)}s`, isStale: players.isStale, count: players.data?.length }
        : null,
    };
  },

  getCacheMetadata() {
    const raw = ls.get(PLAYERS_META_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
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

  isCacheFresh() {
    const c = this.getPlayersData();
    return !!(c && !c.isStale);
  },

  getConfig() { return CACHE_CONFIG; },
};

export default cacheService;
