from app.models.user import User
from app.extensions import db
from typing import Optional
from app.services.user_service import UserService
import hashlib

user_service = UserService()

class AuthService:
    @staticmethod
    def login(user_data: User) -> Optional[dict]:
        username, input_password = user_data['username'], user_data['password']
        user: User = User.query.filter_by(username=username).first()
        if not user or not AuthService.check_password(user.password, input_password):
            return None
        
        return user.to_dict()
    
    @staticmethod
    def register(user_data: User) -> Optional[dict]:
        if AuthService.check_username(user_data['username']):
            return None
        
        # Hash password
        hashed_pwd = hashlib.sha256()
        hashed_pwd.update(user_data['password'].encode())
        user_data['password'] = hashed_pwd.hexdigest()

        user: dict = user_service.create_user(user_data)
        return user

    @staticmethod
    def check_username(username: str) -> bool:
        usernames = [user[0] for user in User.query.with_entities(User.username).all()]
        return username in usernames
    
    @staticmethod
    def check_password(password: str, input_password: str) -> bool:
        hashed_input = hashlib.sha256()
        hashed_input.update(input_password.encode())
        return password == hashed_input.hexdigest()