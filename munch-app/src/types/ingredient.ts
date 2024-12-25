export interface IngredientData {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    recipe_id: string;
}

export interface IngredientDto {
    name?: string;
    quantity?: number;
    unit?: string;
}