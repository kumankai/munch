from app.routes.auth import auth
from flask import request, jsonify
from app.services.auth_service import AuthService

auth_service = AuthService()

@auth.route('/auth/login', methods=['POST'])
def login():
    user_data = request.get_json()
    user = auth_service.login(user_data)
    return jsonify({ 'user': user })

@auth.route('/auth/signup', methods=['POST'])
def signup():
    user_data = request.get_json()
    user = auth_service.register(user_data)
    return jsonify({ 'user': user })