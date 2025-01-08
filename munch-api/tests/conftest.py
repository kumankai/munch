import pytest
import os
from app import create_app
from app.extensions import db
from app.models.user import User
from app.services.auth_service import AuthService

@pytest.fixture
def app():
    # Set environment to testing
    os.environ['FLASK_ENV'] = 'testing'
    
    app = create_app()
    with app.app_context():
        db.create_all()
    yield app
    with app.app_context():
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def test_user(app):
    with app.app_context():
        user = {
            'username': 'testuser',
            'password': 'password123'
        }
        return AuthService.register(user)