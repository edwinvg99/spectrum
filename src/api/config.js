
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const BACKEND_CONFIG = {
  BASE_URL,
  API_PREFIX: '/api',
  HEALTH_ENDPOINT: '/api/health',
  TIMEOUT: 5000,
};

export default BACKEND_CONFIG;
