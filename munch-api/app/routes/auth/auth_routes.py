from app.services.auth_service import AuthService
from app.routes.auth import auth
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, decode_token, get_jwt_identity

@auth.route('/auth/login', methods=['POST'])
def login():
    try:
        result = AuthService.login(request.get_json())
        if not result:
            return jsonify({'error': 'Invalid credentials'}), 401
        return result
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth.route('/auth/signup', methods=['POST'])
def signup():
    try:
        user_data = request.get_json()
        result = AuthService.register(user_data)
        if not result:
            return jsonify({ 'error': 'Username already exists' }), 409
        
        return result
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

@auth.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        access_token = get_jwt()
        refresh_token = decode_token(request.cookies.get('refresh_token'))
        return AuthService.logout(access_token, refresh_token)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@auth.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        user_id = get_jwt_identity()
        result = AuthService.refresh_access_token(user_id)
        return result, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500