const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDevelopment 
  ? 'http://127.0.0.1:5000/api'
  : import.meta.env.VITE_API_URL;