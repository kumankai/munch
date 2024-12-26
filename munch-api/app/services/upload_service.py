import os
from werkzeug.utils import secure_filename
from datetime import datetime

class UploadService:
    UPLOAD_FOLDER = 'app/static/uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

    @staticmethod
    def allowed_file(filename):
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in UploadService.ALLOWED_EXTENSIONS

    @staticmethod
    def save_image(file) -> str:
        if not os.path.exists(UploadService.UPLOAD_FOLDER):
            os.makedirs(UploadService.UPLOAD_FOLDER)

        if file and UploadService.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            new_filename = f"{timestamp}_{filename}"
            file_path = os.path.join(UploadService.UPLOAD_FOLDER, new_filename)
            file.save(file_path)
            
            # Return full URL including domain
            return f"http://localhost:4000/static/uploads/{new_filename}"
        
        raise ValueError("Invalid file type") 