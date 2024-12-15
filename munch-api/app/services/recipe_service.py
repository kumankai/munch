from app.models.recipe import Recipe
from app.extensions import db
from typing import List, Optional

class RecipeService:
    @staticmethod
    def get_all_recipes_by_user_id(user_id: int) -> List[Recipe]:
        return Recipe.query.filter_by(user_id=user_id).all()
    
    @staticmethod
    def get_recipe_by_id(recipe_id: int) -> Optional[Recipe]:
        return Recipe.query.get_or_404(recipe_id)
    
    @staticmethod
    def create_recipe(recipe_data: dict) -> Recipe:
        new_recipe = Recipe(
            title=recipe_data['title'],
            description=recipe_data['description'],
            image_url=recipe_data.get('image_url'),
            user_id=recipe_data['user_id']
        )
        db.session.add(new_recipe)
        db.session.commit()
        return new_recipe
    
    @staticmethod
    def update_recipe(recipe_id: int, recipe_data: dict) -> Recipe:
        recipe = Recipe.query.get_or_404(recipe_id)
        recipe.title = recipe_data.get('title', recipe.title)
        recipe.description = recipe_data.get('description', recipe.description)
        recipe.image_url = recipe_data.get('image_url', recipe.image_url)
        
        db.session.commit()
        return recipe
    
    @staticmethod
    def delete_recipe(recipe_id: int) -> bool:
        recipe = Recipe.query.get_or_404(recipe_id)
        db.session.delete(recipe)
        db.session.commit()
        return True