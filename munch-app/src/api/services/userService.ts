import axios from 'axios';
import { API_BASE_URL } from '../config';

interface UserUpdateData {
  username?: string;
  password?: string;
}

export const userService = {
    async getCurrentUser() {
        const response = await axios.get(`${API_BASE_URL}/api/user/me`, {
          withCredentials: true
        });
        return response.data;
      },
    
    async updateUser(data: UserUpdateData) {
        const response = await axios.put(`${API_BASE_URL}/api/user/update`, data, {
            withCredentials: true
        });
        return response.data;
      },
    
    async deleteUser() {
        const response = await axios.delete(`${API_BASE_URL}/api/user/delete`, {
            withCredentials: true
        });
        return response.data;
      }
}; 