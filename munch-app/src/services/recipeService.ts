import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { RecipeDto, RecipeResponse, IngredientDto, RecipeDataResponse } from '../types';

interface CreateRecipePayload {
    main: RecipeDto;
    ingredients: IngredientDto[];
}

export const recipeService = {
    async getUserRecipes() {
        const response = await axios.get<RecipeDataResponse>(`${API_BASE_URL}/recipes/all`, {
            withCredentials: true
        });
        return response.data;
    },

    async getRecipeByRecipeId(id: number) {
        const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);
        return response.data;
    },

    async getIngredientsByRecipeId(id: number) {
        const response = await axios.get(`${API_BASE_URL}/recipes/ingredients/${id}`, {
            withCredentials: true
        });
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
    },

    async uploadImage(formData: FormData): Promise<string> {
        try {
            const response = await axios.post(`${API_BASE_URL}/upload/recipe_image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            return response.data.image_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
}
