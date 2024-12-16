from app.routes.recipes import recipes
from flask import request, jsonify
from app.services.recipe_service import RecipeService

recipe_service = RecipeService()

@recipes.route('/recipes/all/<int:user_id>', methods=['GET'])
def get_user_recipes(user_id):
    recipes = recipe_service.get_all_recipes_by_user_id(user_id)
    return jsonify({ 'recipes' : recipes })

@recipes.route('/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = recipe_service.get_recipe_by_id(recipe_id)
    return jsonify({ 'recipe': recipe })

@recipes.route('/recipes/create', methods=['POST'])
def create_recipe():
    recipe_data = request.get_json()
    recipe = recipe_service.create_recipe(recipe_data)
    return jsonify({ 'recipe' : recipe })