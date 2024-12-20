from flask_jwt_extended import create_access_token
from app.extensions import db
from app.services.user_service import UserService
from app.models.user import User
from app.models.token_blacklist import TokenBlacklist
from datetime import datetime, timezone
from typing import Optional
import hashlib

class AuthService:
    @staticmethod
    def login(user_data: User) -> Optional[dict]:
        username, input_password = user_data['username'], user_data['password']
        user: User = User.query.filter_by(username=username).first()
        if not user or not AuthService.check_password(user.password, input_password):
            return None

        access_token = create_access_token(identity=str(user.id))

        return { 'user': user.to_dict(), 'access_token': access_token }
    
    @staticmethod
    def register(user_data: User) -> Optional[dict]:
        if AuthService.check_username(user_data['username']):
            return None

        # Hash password
        hashed_pwd = hashlib.sha256()
        hashed_pwd.update(user_data['password'].encode())
        user_data['password'] = hashed_pwd.hexdigest()

        user: dict = UserService.create_user(user_data)

        access_token = create_access_token(identity=str(user['id']))
        return { 'user': user, 'access_token': access_token }

    @staticmethod
    def logout(token_data: dict) -> bool:
        try:
            # Create blacklist entry
            blacklist = TokenBlacklist(
                jti=token_data['jti'],
                expires_at=datetime.fromtimestamp(token_data['exp'], tz=timezone.utc)
            )
            db.session.add(blacklist)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Logout error: {str(e)}")
            db.session.rollback()
            return False
        
    @staticmethod
    def cleanup_expired_tokens() -> int:
        try:
            count = TokenBlacklist.query.filter(
                TokenBlacklist.expires_at < datetime.now(timezone.utc)
            ).delete()
            db.session.commit()
            return count
        except Exception as e:
            print(f"Cleanup error: {str(e)}")
            db.session.rollback()
            return 0

    @staticmethod
    def check_username(username: str) -> bool:
        usernames = [user[0] for user in User.query.with_entities(User.username).all()]
        return username in usernames
    
    @staticmethod
    def check_password(password: str, input_password: str) -> bool:
        hashed_input = hashlib.sha256()
        hashed_input.update(input_password.encode())
        return password == hashed_input.hexdigest()