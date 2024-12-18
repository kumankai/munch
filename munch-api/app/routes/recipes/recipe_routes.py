from app.routes.recipes import recipes
from flask import request, jsonify
from app.services.recipe_service import RecipeService
from app.services.ingredient_service import IngredientService

@recipes.route('/recipes/all/<int:user_id>', methods=['GET'])
def get_user_recipes(user_id):
    recipes = RecipeService.get_all_recipes_by_user_id(user_id)
    return jsonify({ 'recipes' : recipes }), 200

@recipes.route('/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = RecipeService.get_recipe_by_id(recipe_id)
    if not recipe:
        return jsonify({ 'error': 'Recipe not found' }), 404
    return jsonify({ 'recipe': recipe }), 200

@recipes.route('/recipes/create', methods=['POST'])
def create_recipe():
    try:
        recipe_data = request.get_json()
        recipe: dict = RecipeService.create_recipe(recipe_data['main'])
        IngredientService.save_all_ingredients(recipe['id'], recipe_data['ingredients'])
        return jsonify({ 'recipe': recipe }), 201  # Created
    except KeyError as e:
        return jsonify({ 'error': 'Invalid recipe data format' }), 400  # Bad Request
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500  # Internal Server Error

@recipes.route('/recipes/update/<int:recipe_id>', methods=['POST'])
def update_recipe(recipe_id):
    recipe_data = request.get_json()
    new_recipe = RecipeService.update_recipe(recipe_id, recipe_data)
    if not new_recipe:
        return jsonify({ 'error': 'Recipe not found' }), 404
    return jsonify({ 'recipe': new_recipe }), 200

@recipes.route('/recipes/delete/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    result1 = IngredientService.delete_ingredients_by_recipe_id(recipe_id)
    result2 = RecipeService.delete_recipe(recipe_id)
    if not result1 or not result2:
        message = 'Something went wrong'
        status = 500
    else:
        message = 'Recipe deleted'
        status = 204

    return jsonify({ 'message': message }), status