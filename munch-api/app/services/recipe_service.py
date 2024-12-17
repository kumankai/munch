from app.models.recipe import Recipe
from app.extensions import db
from typing import List, Optional

class RecipeService:
    @staticmethod
    def get_all_recipes_by_user_id(user_id: int) -> List[dict]:
        recipes = [recipe.to_dict() for recipe in Recipe.query.filter_by(user_id=user_id).all()]
        return recipes
    
    @staticmethod
    def get_recipe_by_id(recipe_id: int) -> Optional[dict]:
        recipe: Recipe = Recipe.query.get(recipe_id)
        return recipe.to_dict() if recipe else None
    
    @staticmethod
    def create_recipe(recipe_data: dict) -> dict:
        new_recipe = Recipe(
            title=recipe_data['title'],
            instructions=recipe_data['instructions'],
            author=recipe_data['author'],
            image_url=recipe_data.get('image_url'),
            user_id=recipe_data['user_id']
        )

        db.session.add(new_recipe)
        db.session.commit()
        return new_recipe.to_dict()
    
    @staticmethod
    def update_recipe(recipe_id: int, recipe_data: dict) -> dict:
        recipe: Recipe = Recipe.query.get(recipe_id)
        if not recipe: return None

        recipe.title = recipe_data.get('title', recipe.title)
        recipe.instructions = recipe_data.get('instructions', recipe.instructions)
        recipe.author = recipe_data.get('author', recipe.author)
        recipe.image_url = recipe_data.get('image_url', recipe.image_url)
        
        db.session.commit()
        return recipe.to_dict()
    
    @staticmethod
    def delete_recipe(recipe_id: int) -> bool:
        recipe = Recipe.query.get(recipe_id)
        if not recipe: return None
        db.session.delete(recipe)
        db.session.commit()
        return True