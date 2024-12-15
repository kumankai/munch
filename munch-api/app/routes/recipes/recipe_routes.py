from app.routes.recipes import recipes
from flask import request, jsonify

@recipes.route('/recipes/<int:user_id>', methods=['GET'])
def get_user_recipes(user_id):
    return 'List of all recipes'

@recipes.route('/recipes/<int:user_id>', methods=['GET'])
def get_recipe(user_id):
    return f'Recipe with id {user_id}'

@recipes.route('/recipes/create', methods=['POST'])
def create_recipe():
    data = request.get_json()
    return jsonify({ 'data': data })