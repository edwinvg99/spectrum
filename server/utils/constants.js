// ================================
// CONFIGURACIÓN DE JUGADORES
// ================================
export const PLAYERS = [
  {
    name: "Edwin灵DVS",
    tag: "COL",
    region: "latam",
  },
  {
    name: "Pinunaaa",
    tag: "Pau",
    region: "latam",
  },
  {
    name: "ShereKhan",
    tag: "neko",
    region: "latam",
  },
  {
    name: "navidarx",
    tag: "LAN",
    region: "latam",
  },
  {
    name: "Lurasaga",
    tag: "peru",
    region: "latam",
  },
  {
    name: "21savage",
    tag: "2908",
    region: "latam",
  },
  {
    name: "COL Barrilete",
    tag: "COL",
    region: "latam",
  },
  {
    name: "Karito",
    tag: "1610",
    region: "latam",
  },
  {
    name: "Santi Arias",
    tag: "004",
    region: "latam",
  },
  {
    name: "Parca",
    tag: "ARQ22",
    region: "latam",
  },
];

// ================================
// CONFIGURACIÓN DE BACKEND
// ================================
export const BACKEND_CONFIG = {
  BASE_URL: "http://localhost:3001",
  API_PREFIX: "/api/valorant",
  HEALTH_ENDPOINT: "/api/health",
  TIMEOUT: 15000,
};

// ================================
// CONFIGURACIÓN DE API EXTERNA (HENRIK DEV)
// ================================
export const API_URLS = {
  BASE: "https://api.henrikdev.xyz",
  ACCOUNT: (name, tag) => `/valorant/v1/account/${name}/${tag}`,
  MMR_HISTORY: (region, name, tag) => `/valorant/v1/mmr-history/${region}/${name}/${tag}`,
};

// ================================
// IMÁGENES Y RECURSOS
// ================================
export const DEFAULT_IMAGES = {
  UNRANKED_ICON: "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png",
  ERROR_CARD: "https://placehold.co/600x200/ef4444/ffffff?text=Error+Cargando",
  ERROR_RANK: "https://placehold.co/64x64/ef4444/ffffff?text=!",
  LOADING_CARD: "https://placehold.co/600x200/64748b/ffffff?text=Cargando...",
  LOADING_RANK: "https://placehold.co/64x64/64748b/ffffff?text=...",
};

// ================================
// CONFIGURACIÓN DE REGIONES
// ================================
export const REGIONS = {
  LATAM: "latam",
  NA: "na",
  EU: "eu",
  AP: "ap",
  BR: "br",
  KR: "kr",
};

// ================================
// ESTADOS DE LA APLICACIÓN
// ================================
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

// ================================
// MENSAJES DE LA APLICACIÓN
// ================================
export const MESSAGES = {
  LOADING: "Cargando datos de jugadores...",
  SERVER_ERROR: "No se pudo conectar al servidor backend",
  PLAYER_ERROR: "Error cargando datos del jugador",
  SUCCESS: "Datos cargados exitosamente",
  RETRY: "Reintentar",
  UPDATE: "Actualizar Datos",
};

// ================================
// CONFIGURACIÓN DE UI
// ================================
export const UI_CONFIG = {
  CARD_MIN_HEIGHT: "400px",
  ANIMATION_DURATION: "300ms",
  MAX_CARDS_PER_ROW: 4,
  MOBILE_BREAKPOINT: "640px",
};

// ================================
// CONFIGURACIÓN DE CACHÉ
// ================================
export const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutos
  MAX_AGE: 30 * 60 * 1000, // 30 minutos máximo
  AUTO_UPDATE_INTERVAL: 5 * 60 * 1000, // Verificar cada 5 minutos
  VERSION: '1.0.0'
};

// ================================
// UTILIDADES
// ================================
export const UTILS = {
  formatPlayerName: (name, tag) => `${name}#${tag}`,
  isValidRegion: (region) => Object.values(REGIONS).includes(region),
  getDefaultRegion: () => REGIONS.LATAM,
};