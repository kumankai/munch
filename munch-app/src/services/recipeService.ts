import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { RecipeData, RecipeDto, RecipeResponse, IngredientDto } from '../types';

interface CreateRecipePayload {
    main: RecipeDto;
    ingredients: IngredientDto[];
}

export const recipeService = {
    async getUserRecipes() {
        const response = await axios.get<RecipeData[]>(`${API_BASE_URL}/recipes/all`, {
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

    async createRecipe(data: CreateRecipePayload) {
        const response = await axios.post(`${API_BASE_URL}/recipes/create`, data, {
            withCredentials: true
        });
        return response.data;
    },

    async updateRecipe(id: number, data: RecipeDto) {
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
