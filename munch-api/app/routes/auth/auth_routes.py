from app.services.auth_service import AuthService
from app.routes.auth import auth
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

@auth.route('/auth/login', methods=['POST'])
def login():
    user_data = request.get_json()
    result = AuthService.login(user_data)
    if not result:
        return jsonify({ 'error': 'Invalid credentials' }), 401
    return jsonify({ 'result': result }), 200

@auth.route('/auth/signup', methods=['POST'])
def signup():
    user_data = request.get_json()
    result = AuthService.register(user_data)
    if not result:
        return jsonify({ 'error': 'Username already exists' }), 409
    
    return jsonify({ 'result': result }), 201

@auth.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        token_data = get_jwt()
        if AuthService.logout(token_data):
            return jsonify({'message': 'Successfully logged out'}), 200
        return jsonify({'error': 'Error logging out'}), 500
    except Exception as e:
        print(f"Logout route error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500