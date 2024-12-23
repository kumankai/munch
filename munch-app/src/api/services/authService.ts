import axios from 'axios';
import { API_BASE_URL } from '../config';

interface LoginData {
  username: string;
  password: string;
}

interface SignupData {
  username: string;
  password: string;
}

export const authService = {
  async login(data: LoginData) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
  },

  async signup(data: SignupData) {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
    return response.data;
  },

  async logout() {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
        withCredentials: true
      });
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove the token even if the request fails
      localStorage.removeItem('accessToken');
      throw error;
    }
  },

  async refreshToken(oldAccessToken: string) {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      old_access_token: oldAccessToken
    });
    return response.data;
  }
}; 