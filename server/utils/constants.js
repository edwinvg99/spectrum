// ===============================
// CONFIGURACIÓN DE JUGADORES
// ===============================
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
    name: "Lurasaga",
    tag: "peru",
    region: "latam",
  },
  {
    name: "COL Barrilete",
    tag: "COL",
    region: "latam",
  },
  {
    name: "stargirl",
    tag: "743",
    region: "latam",
  },
  {
    name: "Parca",
    tag: "ARQ22",
    region: "latam",
  },
  {
    name: "COL EL Diablo",
    tag: "CLDAS",
    region: "latam",
  },
  {
    name: "VeIox",
    tag: "Rolo",
    region: "latam",
  },
    {
    name: "MPX",
    tag: "666",
    region: "latam",
  },
];

// ================================
// CONFIGURACIÓN DE BACKEND
// ================================
const isDevelopment = process.env.NODE_ENV !== "production";

// In dev, use the Vite proxy path (/api-local → localhost:3001) to avoid CORS.
// In prod, use same-origin relative paths (Express serves the React build).
export const BACKEND_CONFIG = {
  BASE_URL: isDevelopment ? "/api-local" : "",
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
  MMR_HISTORY: (region, name, tag) =>
    `/valorant/v1/mmr-history/${region}/${name}/${tag}`,
};

// ================================
// IMÁGENES Y RECURSOS
// ================================
export const DEFAULT_IMAGES = {
  UNRANKED_ICON:
    "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png",
  DEFAULT_AVATAR:
    "https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818f5c369e45/smallart.png",
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
  TTL:                  6  * 60 * 60 * 1000,       // 6h  — stale threshold
  MAX_AGE:              24 * 60 * 60 * 1000,       // 24h — hard expire
  AUTO_UPDATE_INTERVAL: 60 * 60 * 1000,            // check every 1h
  PLAYER_CARD_TTL:      7  * 24 * 60 * 60 * 1000,  // 7 days — card UUIDs rarely change
  VERSION: "2.0.0",
};

// ================================
// UTILIDADES
// ================================
export const UTILS = {
  formatPlayerName: (name, tag) => `${name}#${tag}`,
  isValidRegion: (region) => Object.values(REGIONS).includes(region),
  getDefaultRegion: () => REGIONS.LATAM,
};
