from flask import Blueprint

# /api/users/
user = Blueprint('users', __name__)

from app.routes.user import user_routes