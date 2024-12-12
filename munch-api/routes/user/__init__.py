from flask import Blueprint

# /api/users/
user = Blueprint('users', __name__)

from routes.user import userRoutes