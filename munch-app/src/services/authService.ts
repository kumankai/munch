import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { LoginData, SignupData } from '../types';

export const authService = {
  async login(data: LoginData) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data, {
      withCredentials: true
    });
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
    }
    return response.data;
  },

  async signup(data: SignupData) {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, data, {
      withCredentials: true
    });
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
    }
    return response.data;
  },

  async refreshToken() {
    const oldAccessToken = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`, 
      { access_token: oldAccessToken },
      { withCredentials: true }
    );
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
    }
    return response.data;
  },

  async logout() {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        { withCredentials: true }
      );
    } finally {
      localStorage.removeItem('accessToken');
    }
  }
};