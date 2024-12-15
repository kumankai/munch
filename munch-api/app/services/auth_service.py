from app.models.user import User
from app.extensions import db
from typing import Optional
from app.services.user_service import UserService

user_service = UserService()

class AuthService:
    @staticmethod
    def login(username: str, password: str) -> Optional[User]:
        user = User.query.filter_by(username=username).first()
        if not user or user['username'] != password:
            return None
        
        return user.to_dict()
    
    @staticmethod
    def register(user_data: User) -> Optional[dict]:
        if AuthService.checkUsername(user_data['username']):
            return None
        user = user_service.create_user(user_data)
        return user

    @staticmethod
    def checkUsername(username: str) -> bool:
        usernames = [user[0] for user in User.query.with_entities(User.username).all()]
        return username in usernames