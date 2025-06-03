import axios from 'axios';
import { BACKEND_CONFIG, MESSAGES } from '../utils/constants';
import { cacheService } from './cacheService';

// Configurar axios con las constantes
const api = axios.create({
  baseURL: BACKEND_CONFIG.BASE_URL + BACKEND_CONFIG.API_PREFIX,
  timeout: BACKEND_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejo de respuestas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    
    // Manejo específico de errores
    if (error.code === 'ECONNREFUSED') {
      throw new Error(MESSAGES.SERVER_ERROR);
    }
    
    if (error.response?.status === 500) {
      throw new Error('Error interno del servidor');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Jugador no encontrado');
    }
    
    return Promise.reject(error);
  }
);

export const valorantAPI = {
  // Obtener datos completos del jugador
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

  // NUEVO: Obtener datos con caché inteligente
  async getPlayersDataWithCache(players, forceRefresh = false) {
    console.log('🔍 Verificando caché para datos de jugadores...');
    
    // Si no es refresh forzado, intentar usar caché
    if (!forceRefresh) {
      const cachedResult = cacheService.getPlayersData();
      
      if (cachedResult && !cachedResult.isStale) {
        console.log('⚡ Usando datos del caché (frescos)');
        return {
          data: cachedResult.data,
          fromCache: true,
          age: cachedResult.age
        };
      }
      
      if (cachedResult && cachedResult.isStale) {
        console.log('📡 Caché obsoleto, actualizando en segundo plano...');
        // Devolver datos del caché inmediatamente, pero actualizar en background
        this.updateCacheInBackground(players);
        return {
          data: cachedResult.data,
          fromCache: true,
          age: cachedResult.age,
          isStale: true
        };
      }
    }

    // No hay caché o es refresh forzado, obtener datos frescos
    console.log('📡 Obteniendo datos frescos de la API...');
    return this.fetchFreshPlayersData(players);
  },

  // NUEVO: Obtener datos frescos y guardar en caché
  async fetchFreshPlayersData(players) {
    const playerPromises = players.map(async (player) => {
      try {
        console.log(`🎯 Procesando ${player.name}#${player.tag}`);
        
        const completeData = await this.getPlayerComplete(
          player.name, 
          player.tag, 
          player.region
        );
        
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
        console.error(`❌ Error para ${player.name}#${player.tag}:`, playerError);
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
    
    // Guardar en caché
    cacheService.savePlayersData(results);
    
    return {
      data: results,
      fromCache: false,
      age: 0
    };
  },

  // NUEVO: Actualizar caché en segundo plano
  async updateCacheInBackground(players) {
    try {
      console.log('🔄 Actualizando caché en segundo plano...');
      await this.fetchFreshPlayersData(players);
      console.log('✅ Caché actualizado en segundo plano');
      
      // Disparar evento personalizado para notificar a la UI
      window.dispatchEvent(new CustomEvent('cacheUpdated', {
        detail: { timestamp: Date.now() }
      }));
    } catch (error) {
      console.error('❌ Error actualizando caché en segundo plano:', error);
    }
  },

  // Obtener solo datos básicos
  async getPlayerBasic(name, tag) {
    try {
      const encodedName = encodeURIComponent(name);
      const encodedTag = encodeURIComponent(tag);
      
      const response = await api.get(`/player/${encodedName}/${encodedTag}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo datos básicos para ${name}#${tag}: ${error.message}`);
    }
  },

  // Obtener solo datos de MMR
  async getPlayerMMR(name, tag, region = 'latam') {
    try {
      const encodedName = encodeURIComponent(name);
      const encodedTag = encodeURIComponent(tag);
      
      const response = await api.get(`/mmr/${region}/${encodedName}/${encodedTag}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo MMR para ${name}#${tag}: ${error.message}`);
    }
  },

  // Verificar estado del servidor
  async checkServerHealth() {
    try {
      const response = await axios.get(BACKEND_CONFIG.BASE_URL + BACKEND_CONFIG.HEALTH_ENDPOINT);
      return response.data;
    } catch (error) {
      console.warn('⚠️ Health check failed:', error.message);
      return { 
        status: 'ERROR', 
        message: 'Servidor no disponible',
        timestamp: new Date().toISOString()
      };
    }
  }
};

export default valorantAPI;