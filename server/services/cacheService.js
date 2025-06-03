// Configuración del caché
const CACHE_KEYS = {
  PLAYERS_DATA: 'valorant_players_cache',
  CACHE_METADATA: 'valorant_cache_metadata'
};

const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutos en milisegundos
  MAX_AGE: 30 * 60 * 1000, // 30 minutos máximo
  VERSION: '1.0.0'
};

export const cacheService = {
  // Guardar datos en caché
  savePlayersData(playersData) {
    try {
      const cacheData = {
        data: playersData,
        timestamp: Date.now(),
        version: CACHE_CONFIG.VERSION
      };
      
      localStorage.setItem(CACHE_KEYS.PLAYERS_DATA, JSON.stringify(cacheData));
      
      // Guardar metadata del caché
      const metadata = {
        lastUpdate: Date.now(),
        playersCount: playersData.length,
        version: CACHE_CONFIG.VERSION
      };
      localStorage.setItem(CACHE_KEYS.CACHE_METADATA, JSON.stringify(metadata));
      
      console.log('💾 Datos guardados en caché:', playersData.length, 'jugadores');
      return true;
    } catch (error) {
      console.error('❌ Error guardando en caché:', error);
      return false;
    }
  },

  // Obtener datos del caché
  getPlayersData() {
    try {
      const cachedData = localStorage.getItem(CACHE_KEYS.PLAYERS_DATA);
      if (!cachedData) {
        console.log('📭 No hay datos en caché');
        return null;
      }

      const parsedData = JSON.parse(cachedData);
      
      // Verificar versión
      if (parsedData.version !== CACHE_CONFIG.VERSION) {
        console.log('🔄 Versión de caché obsoleta, limpiando...');
        this.clearCache();
        return null;
      }

      const age = Date.now() - parsedData.timestamp;
      
      // Si los datos son muy antiguos, no los uses
      if (age > CACHE_CONFIG.MAX_AGE) {
        console.log('⏰ Datos de caché muy antiguos, limpiando...');
        this.clearCache();
        return null;
      }

      console.log(`📦 Datos recuperados del caché (${Math.round(age / 1000)}s de antigüedad)`);
      return {
        data: parsedData.data,
        age: age,
        isStale: age > CACHE_CONFIG.TTL
      };
    } catch (error) {
      console.error('❌ Error leyendo caché:', error);
      this.clearCache();
      return null;
    }
  },

  // Verificar si el caché está fresco
  isCacheFresh() {
    const cachedData = this.getPlayersData();
    return cachedData && !cachedData.isStale;
  },

  // Limpiar caché
  clearCache() {
    try {
      localStorage.removeItem(CACHE_KEYS.PLAYERS_DATA);
      localStorage.removeItem(CACHE_KEYS.CACHE_METADATA);
      console.log('🧹 Caché limpiado');
      return true;
    } catch (error) {
      console.error('❌ Error limpiando caché:', error);
      return false;
    }
  },

  // Obtener metadata del caché
  getCacheMetadata() {
    try {
      const metadata = localStorage.getItem(CACHE_KEYS.CACHE_METADATA);
      return metadata ? JSON.parse(metadata) : null;
    } catch (error) {
      console.error('❌ Error obteniendo metadata del caché:', error);
      return null;
    }
  },

  // Obtener información del estado del caché
  getCacheStatus() {
    const cachedData = this.getPlayersData();
    const metadata = this.getCacheMetadata();
    
    if (!cachedData || !metadata) {
      return {
        hasCache: false,
        age: 0,
        isStale: true,
        nextUpdateIn: 0
      };
    }

    const age = cachedData.age;
    const nextUpdateIn = Math.max(0, CACHE_CONFIG.TTL - age);
    
    return {
      hasCache: true,
      age: age,
      isStale: cachedData.isStale,
      nextUpdateIn: nextUpdateIn,
      lastUpdate: new Date(metadata.lastUpdate).toLocaleString('es-ES'),
      playersCount: metadata.playersCount
    };
  },

  // Método para obtener configuración del caché
  getConfig() {
    return CACHE_CONFIG;
  },

  // Método para verificar si localStorage está disponible
  isLocalStorageAvailable() {
    try {
      const test = '__cache_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('⚠️ localStorage no está disponible');
      return false;
    }
  }
};

export default cacheService;