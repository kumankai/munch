import os
from dotenv import load_dotenv
from datetime import timedelta

if os.getenv('FLASK_ENV') == 'development':
    load_dotenv('.env.dev')
else:
    load_dotenv('.env')

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_ACCESS_TOKEN_SECRET_KEY = os.getenv('JWT_ACCESS_TOKEN_SECRET_KEY')
    JWT_REFRESH_TOKEN_SECRET_KEY = os.getenv('JWT_REFRESH_TOKEN_SECRET_KEY')
    
    if not JWT_ACCESS_TOKEN_SECRET_KEY or not JWT_REFRESH_TOKEN_SECRET_KEY:
        raise ValueError("JWT secret keys not set")

    if not JWT_ACCESS_TOKEN_SECRET_KEY:
        raise ValueError("No JWT_SECRET_KEY set for Flask application")
    
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)