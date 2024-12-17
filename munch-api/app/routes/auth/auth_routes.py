from app.routes.auth import auth
from flask import request, jsonify
from app.services.auth_service import AuthService

@auth.route('/auth/login', methods=['POST'])
def login():
    user_data = request.get_json()
    user = AuthService.login(user_data)
    return jsonify({ 'user': user })

@auth.route('/auth/signup', methods=['POST'])
def signup():
    user_data = request.get_json()
    user = AuthService.register(user_data)
    return jsonify({ 'user': user })