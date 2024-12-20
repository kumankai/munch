from app.services.auth_service import AuthService
from app.routes.auth import auth
from flask import request, jsonify

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