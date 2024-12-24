import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { UserUpdateData } from '../types';

export const userService = {
    async getCurrentUser() {
        const response = await axios.get(`${API_BASE_URL}/user/me`, {
          withCredentials: true
        });
        return response.data;
      },
    
    async updateUser(data: UserUpdateData) {
        const response = await axios.put(`${API_BASE_URL}/user/update`, data, {
            withCredentials: true
        });
        return response.data;
      },
    
    async deleteUser() {
        const response = await axios.delete(`${API_BASE_URL}/user/delete`, {
            withCredentials: true
        });
        return response.data;
      }
}; 