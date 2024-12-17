from app.models.user import User
from app.extensions import db
from typing import List, Optional

class UserService:
    @staticmethod
    def get_user_by_user_id(user_id: int) -> dict:
        user: User = User.query.get(user_id)
        return user.to_dict() if user else None
    
    @staticmethod
    def get_all_users() -> Optional[List[dict]]:
        users: List[User] = User.query.all()
        return [user.to_dict() for user in users]

    @staticmethod
    def create_user(user_data: dict) -> dict:
        new_user = User(
            username = user_data['username'],
            password = user_data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict()
    
    @staticmethod
    def update_user(user_id: int, user_data: dict) -> dict:
        user: User = User.query.get(user_id)
        if not user: return None

        user.username = user_data.get('username', user.username)
        user.password = user_data.get('password', user.password)

        db.session.commit()
        return user.to_dict()

    @staticmethod
    def delete_user(user_id: int) -> bool:
        user = User.query.get(user_id)
        if not user: return None
        db.session.delete(user)
        db.session.commit()
        return True