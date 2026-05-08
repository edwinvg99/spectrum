// ===============================
// PLAYER CONFIGURATION
// ===============================
export const PLAYERS = [

      { name: "Edwin灵DVS",    tag: "COL",   region: "latam" },
      { name: "Pinunaaa",      tag: "Pau",   region: "latam" },
      { name: "Lurasaga",      tag: "peru",  region: "latam" },
      { name: "COL Barrilete", tag: "COL",   region: "latam" },
      { name: "stargil",        tag: "743",  region: "latam" },
      { name: "Parca",         tag: "ARQ22", region: "latam" },
      { name: "COL EL Diablo", tag: "CLDAS", region: "latam" },
      { name: "VeIox",         tag: "Rolo",  region: "latam" },
      { name: "MPX",           tag: "666",   region: "latam" },
];

// ================================
// BACKEND CONFIGURATION
// ================================
// In dev, use the Vite proxy path (/api-local → localhost:3001) to avoid CORS.
// In prod, use same-origin relative paths (Express serves the React build).
export const BACKEND_CONFIG = {
  BASE_URL: import.meta.env.DEV ? "/api-local" : "",
  API_PREFIX: "/api/valorant",
  HEALTH_ENDPOINT: "/api/health",
  TIMEOUT: 15000,
};

// ================================
// EXTERNAL API URLs (HENRIK DEV)
// ================================
export const API_URLS = {
  BASE: "https://api.henrikdev.xyz",
  ACCOUNT: (name, tag) => `/valorant/v1/account/${name}/${tag}`,
  MMR_HISTORY: (region, name, tag) =>
    `/valorant/v1/mmr-history/${region}/${name}/${tag}`,
};

// ================================
// DEFAULT IMAGES
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
// REGIONS
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
// LOADING STATES
// ================================
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

// ================================
// APPLICATION MESSAGES
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
// UI CONFIGURATION
// ================================
export const UI_CONFIG = {
  CARD_MIN_HEIGHT: "400px",
  ANIMATION_DURATION: "300ms",
  MAX_CARDS_PER_ROW: 4,
  MOBILE_BREAKPOINT: "640px",
};

// ================================
// CACHE CONFIGURATION
// ================================
export const CACHE_CONFIG = {
  // Player data (integrantes section)
  TTL: 5 * 60 * 1000,              // 5 min - stale threshold
  MAX_AGE: 30 * 60 * 1000,         // 30 min - purge threshold
  AUTO_UPDATE_INTERVAL: 5 * 60 * 1000,

  // Per-section TTLs (used by generic cache)
  AGENTS_TTL: 60 * 60 * 1000,      // 1 hour  - agents rarely change
  MAPS_TTL: 60 * 60 * 1000,        // 1 hour  - maps rarely change
  STORE_TTL: 15 * 60 * 1000,       // 15 min  - store rotates daily
  NEWS_TTL: 10 * 60 * 1000,        // 10 min  - news updates frequently
  EVENTS_TTL: 15 * 60 * 1000,      // 15 min  - events update moderately
  AGENT_COMP_TTL: 30 * 60 * 1000,  // 30 min  - legacy single-player compositions
  META_COMP_TTL: 60 * 60 * 1000,   // 1 hour  - aggregated meta compositions
  OFFICIAL_NEWS_TTL: 15 * 60 * 1000, // 15 min - official Riot news
  RESULTS_TTL: 10 * 60 * 1000,     // 10 min  - esports match results
  TEAMS_TTL: 30 * 60 * 1000,       // 30 min  - esports team data
  WEAPONS_TTL: 60 * 60 * 1000,     // 1 hour  - weapons rarely change

  VERSION: "1.3.0",   // bumped — wipes old cache entries
};

// ================================
// UTILITIES
// ================================
export const UTILS = {
  formatPlayerName: (name, tag) => `${name}#${tag}`,
  isValidRegion: (region) => Object.values(REGIONS).includes(region),
  getDefaultRegion: () => REGIONS.LATAM,
};
