from flask import Blueprint

# /api/auth/
auth = Blueprint('auth', __name__)

from app.routes.auth import auth_routes