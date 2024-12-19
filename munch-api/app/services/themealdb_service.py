from flask import jsonify
import requests
from app.services.recipe_service import RecipeService
from app.services.ingredient_service import IngredientService
from typing import List

BASEURL = "https://www.themealdb.com/api/json/v1/1/"

class TheMealDbService:
    @staticmethod
    def search_by_ingredients(ingredients: List[str]) -> List[dict]:
        meals = []
        recipe_ids = set() # Remove duplicate recipes

        for ingredient in ingredients:
            recipes = TheMealDbService.search_by_ingredient(ingredient)
            for recipe in recipes:
                if recipe['idMeal'] not in recipe_ids:
                    meals.append(recipe)
                    recipe_ids.add(recipe['idMeal'])

        return meals

    # Search recipes by ingredient
    @staticmethod
    def search_by_ingredient(ingredient: str) -> List[dict]:
        url = f"{BASEURL}filter.php?i={ingredient}"
        response = requests.get(url).json()
        data = response['meals']
        meals = []

        for meal in data:
            meals.append(TheMealDbService.get_recipe(meal['strMeal']))

        return meals

    # Search recipe by recipe name
    @staticmethod
    def get_recipe(recipe_title: str) -> dict:
        url = f"{BASEURL}search.php?s={recipe_title}"
        response = requests.get(url).json()
        return response['meals'][0]