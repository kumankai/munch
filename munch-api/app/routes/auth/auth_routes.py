from app.services.auth_service import AuthService
from app.routes.auth import auth
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, decode_token, get_jwt_identity, verify_jwt_in_request

@auth.route('/auth/login', methods=['POST'])
def login():
    try:
        result = AuthService.login(request.get_json())
        if not result:
            return jsonify({'error': 'Invalid credentials'}), 401
        return result, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth.route('/auth/signup', methods=['POST'])
def signup():
    try:
        user_data = request.get_json()
        result = AuthService.register(user_data)
        if not result:
            return jsonify({ 'error': 'Username already exists' }), 409
        
        return result, 201
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

@auth.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        access_token = get_jwt()
        refresh_token = decode_token(request.cookies.get('refresh_token'))
        return AuthService.logout(access_token, refresh_token), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@auth.route('/auth/refresh', methods=['POST'])
def refresh():
    try:
        refresh_token = request.cookies.get('refresh_token_cookie')
        refresh_token = refresh_token.encode()

        decoded_token = decode_token(refresh_token)
        user_id = decoded_token.get('sub')
        data = request.get_json()
        old_access_token = data['access_token']
        
        result = AuthService.refresh_access_token(
            user_id, 
            old_access_token
        )
        
        if not result:
            return jsonify({ 'error': 'Could not refresh token' }, 500)
        
        return result, 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500