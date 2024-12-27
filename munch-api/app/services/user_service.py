from app.utils.user_checker import check_password
from app.utils.hash_helper import hash_password
from app.services.recipe_service import RecipeService
from app.services.ingredient_service import IngredientService
from app.models.user import User
from app.models.recipe import Recipe
from app.extensions import db
from typing import List

class UserService:
    @staticmethod
    def get_user_by_user_id(user_id: int) -> dict:
        user: User = User.query.get(user_id)
        return user.to_dict() if user else None

    @staticmethod
    def create_user(user_data: dict) -> dict:
        new_user = User(
            username = user_data['username'],
            password = user_data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict()
    
    @staticmethod
    def update_user(user_id: int, user_data: dict) -> dict:
        user: User = User.query.get(user_id)
        if not user:
            return { 'message': 'User not found' }
        if not check_password(user.password, user_data['old_password']):
            return None

        if 'password' in user_data:
            user.password = hash_password(user_data['password'])

        user.username = user_data.get('username', user.username)

        db.session.commit()
        return user.to_dict()

    @staticmethod
    def delete_user(user_id: int) -> bool:
        user: User = User.query.get(user_id)
        if not user: return None
        recipes: List[dict] = RecipeService.get_all_recipes_by_user_id(user.id)
        for recipe in recipes:
            IngredientService.delete_ingredients_by_recipe_id(recipe['id'])
        RecipeService.delete_all_recipes_by_user_id(user.id)

        db.session.delete(user)
        db.session.commit()
        return True