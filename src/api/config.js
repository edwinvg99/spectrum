

// src/api/config.js
const isDevelopment = import.meta.env.DEV;
const PRODUCTION_URL = 'https://spectrum.up.railway.app';

const BASE_URL = isDevelopment 
  ? 'http://localhost:3001'
  : PRODUCTION_URL;

const BACKEND_CONFIG = {
  BASE_URL,
  API_PREFIX: '/api',
  HEALTH_ENDPOINT: '/api/health',
  TIMEOUT: 15000, 
};

export default BACKEND_CONFIG;