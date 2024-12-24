import axios from 'axios';
import { API_BASE_URL } from '../api/config';

interface RecipeData {
    id: number;
    title: string;
    instructions: string;
    author: string;
    image_url: string;
}

interface RecipeUpdateData {
    title?: string;
    instructions?: string;
    author?: string;
    image_url?: string;
}

export const RecipeService = {
    async getRecipesByUserId() {
        const response = await axios.get(`${API_BASE_URL}/recipes/`, {
            withCredentials: true
        })
        return response.data;
    },

    async getRecipeByRecipeId(id: number) {
        const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);
        return response.data;
    },

    async createRecipe(data: RecipeData) {
        const response = await axios.put(`${API_BASE_URL}/recipes/create`, data, {
            withCredentials: true
        });
        return response.data;
    },

    async updateRecipe(id: number, data: RecipeUpdateData) {
        const response = await axios.put(`${API_BASE_URL}/recipes/update/${id}`, data, {
            withCredentials: true
        });
        return response.data;
    },

    async deleteRecipe(id: number) {
        const response = await axios.put(`${API_BASE_URL}/recipes/delete/${id}`, {
            withCredentials: true
        });
        return response.data;
    }

}
