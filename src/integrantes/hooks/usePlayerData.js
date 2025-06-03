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

  // Función para actualizar el estado del caché
  const updateCacheStatus = useCallback(() => {
    const status = cacheService.getCacheStatus();
    setCacheStatus(status);
  }, []);

  // Verificar estado del servidor
  const checkServerHealth = async () => {
    console.log('🏥 Verificando estado del servidor...');
    
    const healthCheck = await valorantAPI.checkServerHealth();
    setServerStatus(healthCheck);
    
    if (healthCheck.status !== 'OK') {
      throw new Error('Servidor backend no disponible');
    }
    
    console.log('✅ Servidor backend funcionando correctamente');
  };

  // Cargar datos de jugadores
  const loadPlayersData = async (forceRefresh = false) => {
    console.log('📊 Cargando datos de jugadores...');
    
    const result = await valorantAPI.getPlayersDataWithCache(PLAYERS, forceRefresh);
    
    setPlayersData(result.data);
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

  // Cargar datos desde caché
  const loadPlayersDataFromCache = () => {
    const cachedResult = cacheService.getPlayersData();
    if (cachedResult) {
      setPlayersData(cachedResult.data);
      updateCacheStatus();
    }
  };

  // Inicializar aplicación
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

  // Manejar refresh
  const handleRefresh = (forceRefresh = true) => {
    console.log(`🔄 ${forceRefresh ? 'Refresh forzado' : 'Refresh normal'}...`);
    setIsUpdatingCache(forceRefresh);
    loadPlayersData(forceRefresh);
  };

  // Limpiar caché
  const handleClearCache = () => {
    cacheService.clearCache();
    updateCacheStatus();
    handleRefresh(true);
  };

  // Configurar efectos
  useEffect(() => {
    initializeApp();
    updateCacheStatus();
    
    // Escuchar actualizaciones de caché en segundo plano
    const handleCacheUpdate = () => {
      console.log('🔔 Caché actualizado, refrescando datos...');
      loadPlayersDataFromCache();
      updateCacheStatus();
      setIsUpdatingCache(false);
    };

    window.addEventListener('cacheUpdated', handleCacheUpdate);
    
    // Configurar actualización automática cada 5 minutos
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
    // Estados
    playersData,
    loadingState,
    error,
    serverStatus,
    cacheStatus,
    isUpdatingCache,
    
    // Funciones
    handleRefresh,
    handleClearCache,
    initializeApp
  };
};