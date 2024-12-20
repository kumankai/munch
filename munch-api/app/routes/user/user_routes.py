from app.routes.user import user
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.user_service import UserService

@user.route('/user/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = UserService.get_user_by_user_id(user_id)
    if not user:
        return jsonify({ 'error': 'User not found' }), 404
    return jsonify({ 'user': user }), 200

@user.route('/user/delete', methods=['DELETE'])
@jwt_required()
def delete():
    user_id = get_jwt_identity()
    success = UserService.delete_user(user_id)
    if not success:
        return jsonify({ 'error': 'User not found' }), 404
    return jsonify({ 'message': 'User deleted successfully' }), 204

@user.route('/user/update', methods=['PUT'])
@jwt_required()
def update():
    user_id = get_jwt_identity()
    user_data = request.get_json()
    updated_user = UserService.update_user(user_id, user_data)
    if not updated_user:
        return jsonify({ 'error': 'User not found' }), 404
    return jsonify({ 'user': updated_user }), 200