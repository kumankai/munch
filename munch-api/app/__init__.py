from flask import Flask
from flask_migrate import Migrate
from app.config import Config
from app.extensions import db
from app.models import User, Recipe, Ingredient
from app.routes.recipes import recipes
from app.routes.user import user
from app.routes.auth import auth
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

    db.init_app(app)
    migrate = Migrate(app, db)

    # Register routes
    app.register_blueprint(recipes, url_prefix='/api')
    app.register_blueprint(user, url_prefix='/api')
    app.register_blueprint(auth, url_prefix='/api')

    # Create database tables
    with app.app_context():
        db.create_all()

    return app