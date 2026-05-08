import { useState, useEffect, useCallback } from 'react';
import { valorantAPI } from '../../../server/services/valorantApi.jsx';
import { cacheService } from '../../../server/services/cacheService.js';
import { PLAYERS, LOADING_STATES, CACHE_CONFIG } from '../../../server/utils/constants.js';

const sortByElo = (players) =>
  [...players].sort((a, b) => (b.mmrData?.elo || 0) - (a.mmrData?.elo || 0));

export const usePlayerData = () => {
  const [playersData,     setPlayersData]     = useState([]);
  const [loadingState,    setLoadingState]    = useState(LOADING_STATES.LOADING);
  const [error,           setError]           = useState(null);
  const [serverStatus,    setServerStatus]    = useState(null);
  const [cacheStatus,     setCacheStatus]     = useState(null);
  const [isUpdatingCache, setIsUpdatingCache] = useState(false);

  const updateCacheStatus = useCallback(() => {
    setCacheStatus(cacheService.getCacheStatus());
  }, []);

  const checkServerHealth = async () => {
    const health = await valorantAPI.checkServerHealth();
    setServerStatus(health);
    if (health.status !== 'OK') throw new Error('Servidor backend no disponible');
  };

  const loadPlayersData = async (forceRefresh = false) => {
    const result = await valorantAPI.getPlayersDataWithCache(PLAYERS, forceRefresh);
    setPlayersData(sortByElo(result.data));
    updateCacheStatus();

    if (result.fromCache) {
      if (result.isStale) setIsUpdatingCache(true);
    }
  };

  const loadPlayersDataFromCache = () => {
    const cached = cacheService.getPlayersData();
    if (cached) {
      setPlayersData(sortByElo(cached.data));
      updateCacheStatus();
    }
  };

  const initializeApp = async () => {
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    try {
      await checkServerHealth();
      await loadPlayersData();
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      console.error('[usePlayerData] Init error:', err);
      setError(err.message);
      setLoadingState(LOADING_STATES.ERROR);
    }
  };

  const handleRefresh = (forceRefresh = true) => {
    setIsUpdatingCache(forceRefresh);
    loadPlayersData(forceRefresh);
  };

  const handleClearCache = () => {
    cacheService.clearCache();
    updateCacheStatus();
    handleRefresh(true);
  };

  /**
   * Refresh a single player's data in real time (called when user clicks a card).
   * Updates both the local state and the cache entry for that player.
   */
  const handlePlayerRefresh = useCallback(async (name, tag, region = 'latam') => {
    const fresh = await valorantAPI.refreshSinglePlayer(name, tag, region);
    if (!fresh) return;

    setPlayersData((prev) => {
      const updated = prev.map((p) =>
        p.name === name && p.tag === tag ? { ...p, ...fresh } : p
      );
      return sortByElo(updated);
    });
    updateCacheStatus();
  }, [updateCacheStatus]);

  useEffect(() => {
    initializeApp();
    updateCacheStatus();

    const handleCacheUpdate = () => {
      loadPlayersDataFromCache();
      updateCacheStatus();
      setIsUpdatingCache(false);
    };
    window.addEventListener('cacheUpdated', handleCacheUpdate);

    // Check every hour whether the 6h stale threshold has been crossed
    const autoUpdateInterval = setInterval(() => {
      if (cacheService.getCacheStatus().isStale) {
        handleRefresh(false);
      }
    }, CACHE_CONFIG.AUTO_UPDATE_INTERVAL);

    return () => {
      window.removeEventListener('cacheUpdated', handleCacheUpdate);
      clearInterval(autoUpdateInterval);
    };
  }, [updateCacheStatus]);

  return {
    playersData,
    loadingState,
    error,
    serverStatus,
    cacheStatus,
    isUpdatingCache,
    handleRefresh,
    handleClearCache,
    handlePlayerRefresh,
    initializeApp,
  };
};
