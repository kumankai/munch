const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:4000/api'
  : 'https://youamunch.duckdns.org/api';