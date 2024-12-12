from routes.recipes import recipes
from flask import request, jsonify

@recipes.route('/recipes/', methods=['GET'])
def get_recipes():
    return 'List of all recipes'

@recipes.route('/recipes/<int:id>', methods=['GET'])
def get_recipe(id):
    return f'Recipe with id {id}'

@recipes.route('/recipes/create', methods=['POST'])
def create_recipe():
    data = request.get_json()
    return jsonify({ 'data': data })