from app.models import User, Recipe, Ingredient, TokenBlacklist
from flask import Flask
from app.config import Config
from app.extensions import db, jwt
from app.routes.recipes import recipes
from app.routes.user import user
from app.routes.auth import auth

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    jwt.init_app(app)
    db.init_app(app)

    # Check if token is blacklisted
    @jwt.token_in_blocklist_loader
    def check_if_token_in_blacklist(jwt_header, jwt_payload):
        jti = jwt_payload['jti']
        return TokenBlacklist.query.filter_by(jti=jti).first() is not None

    # Register routes
    app.register_blueprint(recipes, url_prefix='/api')
    app.register_blueprint(user, url_prefix='/api')
    app.register_blueprint(auth, url_prefix='/api')

    # Create database tables
    with app.app_context():
        db.create_all()

    return app