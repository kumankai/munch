import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { RecipeData, RecipeUpdateData, RecipeAPIReponse } from '../types';

interface RecipeResponse {
    recipes: RecipeAPIReponse[];
}

export const recipeService = {
    async getRecipesByUserId() {
        const response = await axios.get(`${API_BASE_URL}/recipes/all`, {
            withCredentials: true
        })
        return response.data;
    },

    async getRecipeByRecipeId(id: number) {
        const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);
        return response.data;
    },

    async getRecipesByIngredients(ingredients: string[]): Promise<RecipeResponse> {
        const response = await axios.post<RecipeResponse>(
            `${API_BASE_URL}/recipes/search`,
            { ingredients },
            { withCredentials: true }
        );
        return response.data;
    },

    async createRecipe(data: RecipeData) {
        const response = await axios.post(`${API_BASE_URL}/recipes/create`, data, {
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
        const response = await axios.delete(`${API_BASE_URL}/recipes/delete/${id}`, {
            withCredentials: true
        });
        return response.data;
    }

}
