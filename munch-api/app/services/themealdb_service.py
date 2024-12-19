from flask import jsonify
import requests
from app.services.recipe_service import RecipeService
from app.services.ingredient_service import IngredientService
from typing import List

class TheMealDbService:
    @staticmethod
    def search_by_ingredients(ingredients: List[str]) -> List[dict]:
        pass

    @staticmethod
    def search_by_ingredient(ingredient: str) -> dict:
        pass

    @staticmethod
    def get_recipe(recipe_title: str) -> dict:
        pass