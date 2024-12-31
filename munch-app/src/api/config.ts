const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:4000/api'
  : import.meta.env.VITE_API_URL + '/api';