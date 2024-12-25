from flask import make_response, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token, get_jwt
from app.extensions import db
from app.services.user_service import UserService
from app.services.token_service import TokenService
from app.models.user import User
from app.models.token_blacklist import TokenBlacklist
from datetime import datetime, timezone
from typing import Optional
import hashlib
import os

isSecure = True if os.getenv('FLASK_ENV') == 'production' else False

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

            # Check for existing valid session
            existing_token = request.cookies.get('refresh_token')
            if existing_token:
                try:
                    decode_token(existing_token)
                    return make_response(jsonify({
                        'error': 'Already logged in'
                    })), 400
                except:
                    # Token is invalid or expired, continue with login
                    pass

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
            return AuthService.create_authorization_response(user, str(user['id']))
        except Exception as e:
            print(f"Register error: {str(e)}")
            return None

    @staticmethod
    def logout(access_token: dict, refresh_token: dict) -> Optional[tuple]:
        try:
            TokenService.blacklist_tokens(access_token, refresh_token)
            
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
                tokens = TokenService.create_tokens(user_id)

                response = make_response(jsonify({
                    'user': {
                        'id': user['id'],
                        'username': user['username']
                    },
                    'access_token': tokens['access_token']
                }))

                # Set refresh token in HTTP-only cookie
                response.set_cookie(
                    'refresh_token_cookie',
                    tokens['refresh_token'],
                    httponly=True,
                    secure=isSecure,
                    samesite='Strict',
                    max_age=30 * 24 * 60 * 60  # 30 days
                )

                return response, 200
            except Exception as e:
                print(f"Authorization error: {str(e)}")
                return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def refresh_access_token(user_id: str, old_access_token: str = None) -> Optional[dict]:
        # Create a new access token using refresh token
        try:
            # Blacklist the old access token if provided
            if old_access_token:
                try:
                    token_data = decode_token(old_access_token, verify=False)
                    
                    TokenService.blacklist(token_data)
                except Exception as e:
                    print(f"Error blacklisting old token: {str(e)}")
                    # Continue even if blacklisting fails
                    pass

            access_token = create_access_token(identity=user_id)
            return {
                'access_token': access_token
            }
        except Exception as e:
            print(f"Refresh error: {str(e)}")
            return None

    @staticmethod
    def check_username(username: str) -> bool:
        usernames = [user[0] for user in User.query.with_entities(User.username).all()]
        return username in usernames
    
    @staticmethod
    def check_password(password: str, input_password: str) -> bool:
        hashed_input = hashlib.sha256()
        hashed_input.update(input_password.encode())
        return password == hashed_input.hexdigest()