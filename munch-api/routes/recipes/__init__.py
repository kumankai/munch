from flask import Blueprint

# /api/recipes/
recipes = Blueprint('recipes', __name__)

from routes.recipes import recipeRoutes