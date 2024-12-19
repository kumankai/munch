import os
from dotenv import load_dotenv

if os.getenv('FLASK_ENV') == 'development':
    load_dotenv('.env.dev')
else:
    load_dotenv('.env')

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False