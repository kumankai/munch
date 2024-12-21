from flask import make_response, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token
from app.extensions import db
from app.services.user_service import UserService
from app.models.user import User
from app.models.token_blacklist import TokenBlacklist
from datetime import datetime, timezone
from typing import Optional
import hashlib

class AuthService:
    @staticmethod
    def login(user_data: dict) -> Optional[tuple]:
        try:
            username, input_password = user_data['username'], user_data['password']
            if not username or not input_password:
                return None
            
            user: User = User.query.filter_by(username=username).first()
            if not user or not AuthService.check_password(user.password, input_password):
                return None

            return AuthService.create_authorization_response(user.to_dict(), str(user.id))
        except Exception as e:
            print(f"Login error: {str(e)}")
            return None
    
    @staticmethod
    def register(user_data: User) -> Optional[dict]:
        try:
            if AuthService.check_username(user_data['username']):
                return None

            # Hash password
            hashed_pwd = hashlib.sha256()
            hashed_pwd.update(user_data['password'].encode())
            user_data['password'] = hashed_pwd.hexdigest()

            user: dict = UserService.create_user(user_data)

            return AuthService.create_authorization_response(user, str(user['user_id']))
        except Exception as e:
            print(f"Register error: {str(e)}")
            return None

    @staticmethod
    def logout(access_token: dict, refresh_token: dict) -> Optional[tuple]:
        try:
            # Create blacklist entry
            access_blacklist = TokenBlacklist(
                jti=access_token['jti'],
                expires_at=datetime.fromtimestamp(access_token['exp'], tz=timezone.utc)
            )
            db.session.add(access_blacklist)

            if refresh_token:
                refresh_blacklist = TokenBlacklist(
                    jti=refresh_token['jti'],
                    expires_at=datetime.fromtimestamp(refresh_token['exp'], tz=timezone.utc)
                )
            db.session.add(refresh_blacklist)
            db.session.commit()
            
            response = make_response(jsonify({
                'message': 'Successfully logged out'
            }))

            # Remove refresh token cookie
            response.delete_cookie('refresh_token')
            
            return response, 200
        except Exception as e:
            print(f"Logout error: {str(e)}")
            db.session.rollback()
            return None
        
    @staticmethod
    def create_authorization_response(user: dict, user_id: str) -> Optional[tuple]:
            try:
                # Create tokens
                tokens = AuthService.create_tokens(user_id)

                response = make_response(jsonify({
                    'user': user,
                    'access_token': tokens['access_token'],
                    'refresh_token': tokens['refresh_token']
                }))

                # Set refresh token in HTTP-only cookie
                response.set_cookie(
                    'refresh_token',
                    tokens['refresh_token'],
                    httponly=True,
                    secure=True,
                    samesite='Strict',
                    max_age=30 * 24 * 60 * 60  # 30 days
                )

                return response, 200
            except Exception as e:
                print(f"Authorization error: {str(e)}")
                return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def create_tokens(user_id: str) -> dict:
        # Create access token with access token secret
        access_token = create_access_token(
            identity=user_id
        )
        
        # Create refresh token with refresh token secret
        refresh_token = create_refresh_token(
            identity=user_id,
            additional_claims={'type': 'refresh'},  # Mark as refresh token
        )

        return {'access_token': access_token, 'refresh_token': refresh_token}
    
    @staticmethod
    def refresh_access_token(user_id: str) -> Optional[dict]:
        # Create a new access token using refresh token
        try:
            access_token = create_access_token(identity=user_id)
            return {
                'access_token': access_token
            }
        except Exception as e:
            print(f"Refresh error: {str(e)}")
            return None
        
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