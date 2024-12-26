from flask import Blueprint

# /api/upload/
upload = Blueprint('upload', __name__)

from app.routes.upload import upload_routes