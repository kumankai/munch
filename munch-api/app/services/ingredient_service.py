from app.models.ingredient import Ingredient
from app.extensions import db
from typing import List, Optional

class IngredientService:
    @staticmethod
    def get_ingredients_by_recipe_id(recipe_id: int) -> List[Optional[dict]]:
        ingredients: List[Ingredient] = [ingredient.to_dict() for ingredient in Ingredient.query.filter_by(recipe_id=recipe_id).all()]
        return ingredients
    
    @staticmethod
    def save_ingredient(ingredient_data: dict) -> Ingredient:
        new_ingredient = Ingredient(
            name = ingredient_data['name'],
            quantity = ingredient_data['quantity'],
            unit = ingredient_data['unit'],
            recipe_id = ingredient_data['recipe_id'],
        )
        db.session.add(new_ingredient)
        db.session.commit()
        return new_ingredient.to_dict()
    
    @staticmethod
    def save_all_ingredients(recipe_id:int, ingredients: List[dict]) -> bool:
        try:
            for i in range(20):
                ingredient = ingredients[i]
                ingredient['recipe_id'] = recipe_id
                IngredientService.save_ingredient(ingredient)
        except:
            return False
        
    @staticmethod
    def update_ingredient(ingredient_id: int, ingredient_data: dict) -> Optional[dict]:
        ingredient: Ingredient = Ingredient.query.get(ingredient_id)
        if not ingredient: return None

        ingredient.name = ingredient_data.get('name', ingredient.name)
        ingredient.quantity = ingredient_data.get('quantity', ingredient.quantity)
        ingredient.unit = ingredient_data.get('unit', ingredient.unit)

        db.session.commit()
        return ingredient.to_dict()

    @staticmethod
    def update_all_ingredients_by_recipe_id(ingredients: List[dict]) -> bool:
        try:
            for ingredient in ingredients:
                IngredientService.update_ingredient(ingredient['id'], ingredient)
        except:
            return False
        
    @staticmethod
    def delete_ingredients_by_recipe_id(recipe_id: int) -> bool:
        try:
            ingredients: List[Ingredient] = [ingredient for ingredient in Ingredient.query.filter_by(recipe_id=recipe_id).all()]
            if not ingredients: return False

            for ingredient in ingredients:
                db.session.delete(ingredient)

            return True
        except:
            return False