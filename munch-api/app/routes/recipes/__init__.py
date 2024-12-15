from flask import Blueprint

# /api/recipes/
recipes = Blueprint('recipes', __name__)

from app.routes.recipes import recipe_routes