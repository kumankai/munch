import axios from 'axios';
import { authService } from '../services/authService';

// Enable credentials for all requests to handle cookies
axios.defaults.withCredentials = true;

let isRefreshing = false;

// Request interceptor to add access token to localStorage
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Ensure withCredentials is set for all requests
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !isRefreshing &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        // Update the Authorization header with the new token
        const newToken = localStorage.getItem('accessToken');
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        isRefreshing = false;
        return axios(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        throw refreshError;
      }
    }
    
    return Promise.reject(error);
  }
); 