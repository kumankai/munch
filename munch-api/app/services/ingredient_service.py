from app.models.ingredient import Ingredient
from app.extensions import db
from typing import List, Optional

class IngredientService:
    @staticmethod
    def get_ingredients_by_recipe_id(recipe_id: int) -> List[Optional[dict]]:
        ingredients: List[Ingredient] = [ingredient.to_dict() for ingredient in Ingredient.query.filter_by(recipe_id=recipe_id).all()]
        return ingredients
    
    @staticmethod
    def save_ingredient(ingredient: dict) -> Ingredient:
        new_ingredient = Ingredient(
            name = ingredient['name'],
            quantity = ingredient['quantity'],
            unit = ingredient['unit'],
            recipe_id = ingredient['recipe_id'],
        )
        db.session.add(new_ingredient)
        db.session.commit()
        return new_ingredient.to_dict()