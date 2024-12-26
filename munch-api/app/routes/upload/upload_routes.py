from app.routes.upload import upload
from flask import request, jsonify
from app.services.upload_service import UploadService
from flask_jwt_extended import jwt_required

@upload.route('/upload/recipe_image', methods=['POST'])
@jwt_required()
def upload_file():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        image_url = UploadService.save_image(file)
        return jsonify({'image_url': image_url}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400 