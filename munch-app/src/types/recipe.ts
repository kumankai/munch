export interface Recipe {
    id: number;
    title: string;
    instructions: string;
    author: string;
    image_url: string;
}

export interface RecipeData {
    id: number;
    title: string;
    instructions: string;
    author: string;
    image_url: string;
}

export interface RecipeUpdateData {
    title?: string;
    instructions?: string;
    author?: string;
    image_url?: string;
}

export interface IngredientsRequest {
    ingredients: string[];
} 