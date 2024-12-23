from app.models import User, Recipe, Ingredient, TokenBlacklist
from flask import Flask, current_app
from flask_cors import CORS
from app.config import Config
from app.extensions import db, jwt
from app.utils.jwt_callbacks import register_jwt_callbacks
from app.middleware.cors_handler import handle_options
from app.routes.recipes import recipes
from app.routes.user import user
from app.routes.auth import auth

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    
    app.config['JWT_SECRET_KEY'] = app.config['JWT_ACCESS_TOKEN_SECRET_KEY']
    jwt.init_app(app)

    register_jwt_callbacks(jwt)

    CORS(app, supports_credentials=True)

    app.before_request(handle_options)

    # Register routes
    app.register_blueprint(recipes, url_prefix='/api')
    app.register_blueprint(user, url_prefix='/api')
    app.register_blueprint(auth, url_prefix='/api')

    # Create database tables
    with app.app_context():
        db.create_all()

    return app