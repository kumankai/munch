from flask import jsonify
import requests
from app.services.recipe_service import RecipeService
from app.services.ingredient_service import IngredientService
from typing import List

BASEURL = "https://www.themealdb.com/api/json/v1/1/"

class TheMealDbService:
    @staticmethod
    def search_by_ingredients(ingredients: List[str]) -> List[dict]:
        pass

    # Search recipe by ingredient
    @staticmethod
    def search_by_ingredient(ingredient: str) -> dict:
        url = f"{BASEURL}filter.php?i={ingredient}"
        
        pass

    # Search recipe by recipe name
    @staticmethod
    def get_recipe(recipe_title: str) -> dict:
        url = f"{BASEURL}search.php?s={recipe_title}"
        pass