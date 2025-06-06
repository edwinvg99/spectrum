import { useState, useEffect, useCallback } from 'react';
import { valorantAPI } from '../../../server/services/valorantApi.jsx';
import { cacheService } from '../../../server/services/cacheService.js';
import { PLAYERS, LOADING_STATES } from '../../../server/utils/constants.js';

export const usePlayerData = () => {
  const [playersData, setPlayersData] = useState([]);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.LOADING);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);
  const [cacheStatus, setCacheStatus] = useState(null);
  const [isUpdatingCache, setIsUpdatingCache] = useState(false);

  const updateCacheStatus = useCallback(() => {
    const status = cacheService.getCacheStatus();
    setCacheStatus(status);
  }, []);

  const checkServerHealth = async () => {
    console.log('🏥 Verificando estado del servidor...');
    const healthCheck = await valorantAPI.checkServerHealth();
    setServerStatus(healthCheck);
    if (healthCheck.status !== 'OK') {
      throw new Error('Servidor backend no disponible');
    }
    console.log('✅ Servidor backend funcionando correctamente');
  };

  // Función para cargar y ORDENAR datos de jugadores
  const loadPlayersData = async (forceRefresh = false) => {
    console.log('📊 Cargando datos de jugadores...');
    
    const result = await valorantAPI.getPlayersDataWithCache(PLAYERS, forceRefresh);
    
    // --- INICIO DE LA LÓGICA DE ORDENAMIENTO ---
    // Clonamos el array para no mutar el original antes de ordenar
    const sortedPlayers = [...result.data].sort((a, b) => {
      // Accedemos al ELO de mmrData de cada jugador.
      // Si el ELO no está disponible, usamos 0 para el propósito de ordenamiento.
      const eloA = a.mmrData?.elo || 0;
      const eloB = b.mmrData?.elo || 0;
      
      // Ordena de mayor ELO a menor ELO (descendente)
      return eloB - eloA;
    });

    setPlayersData(sortedPlayers); // Establecemos los datos YA ORDENADOS
    // --- FIN DE LA LÓGICA DE ORDENAMIENTO ---

    updateCacheStatus();
    
    if (result.fromCache) {
      console.log(`⚡ Datos cargados desde caché (${Math.round(result.age / 1000)}s)`);
      if (result.isStale) {
        setIsUpdatingCache(true);
      }
    } else {
      console.log('📡 Datos cargados desde API');
    }
    
    console.log('🎉 Datos de jugadores cargados exitosamente');
  };

  // Cargar datos desde caché (también ordenaremos aquí si es necesario)
  const loadPlayersDataFromCache = () => {
    const cachedResult = cacheService.getPlayersData();
    if (cachedResult) {
      // Ordenamos los datos del caché antes de establecerlos en el estado
      const sortedPlayers = [...cachedResult.data].sort((a, b) => {
        const eloA = a.mmrData?.elo || 0;
        const eloB = b.mmrData?.elo || 0;
        return eloB - eloA;
      });
      setPlayersData(sortedPlayers);
      updateCacheStatus();
    }
  };

  // Resto del hook permanece igual...
  const initializeApp = async () => {
    console.log('🚀 Inicializando aplicación...');
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);
    
    try {
      await checkServerHealth();
      await loadPlayersData();
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      console.error('💥 Error inicializando aplicación:', err);
      setError(err.message);
      setLoadingState(LOADING_STATES.ERROR);
    }
  };

  const handleRefresh = (forceRefresh = true) => {
    console.log(`🔄 ${forceRefresh ? 'Refresh forzado' : 'Refresh normal'}...`);
    setIsUpdatingCache(forceRefresh);
    loadPlayersData(forceRefresh);
  };

  const handleClearCache = () => {
    cacheService.clearCache();
    updateCacheStatus();
    handleRefresh(true);
  };

  useEffect(() => {
    initializeApp();
    updateCacheStatus();
    
    const handleCacheUpdate = () => {
      console.log('🔔 Caché actualizado, refrescando datos...');
      loadPlayersDataFromCache(); // Esto ahora ordenará
      updateCacheStatus();
      setIsUpdatingCache(false);
    };

    window.addEventListener('cacheUpdated', handleCacheUpdate);
    
    const autoUpdateInterval = setInterval(() => {
      if (cacheService.getCacheStatus().isStale) {
        console.log('⏰ Actualización automática programada');
        handleRefresh(false);
      }
    }, 5 * 60 * 1000);

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
    initializeApp
  };
};


