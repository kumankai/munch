import axios from 'axios';
import { authService } from './services/authService';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const oldToken = localStorage.getItem('accessToken');
        if (!oldToken) {
          throw new Error('No access token found');
        }
        
        const { accessToken } = await authService.refreshToken(oldToken);
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (error) {
        console.log(error);
        // Redirect to login
      }
    }
    return Promise.reject(error);
  }
); 