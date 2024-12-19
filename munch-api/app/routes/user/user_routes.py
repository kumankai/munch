from app.routes.user import user
from flask import request, jsonify
from app.services.user_service import UserService

@user.route('/user/<int:user_id>', methods=['GET'])
def about(user_id):
    user = UserService.get_user_by_user_id(user_id)
    if not user:
        return jsonify({ 'error': 'User not found' }), 404
    return jsonify({ 'user': user }), 200

@user.route('/user/delete/<int:user_id>', methods=['DELETE'])
def delete(user_id):
    success = UserService.delete_user(user_id)
    if not success:
        return jsonify({ 'error': 'User not found' }), 404
    return jsonify({ 'message': 'User deleted successfully' }), 204

@user.route('/user/update/<int:user_id>', methods=['PUT'])
def update(user_id):
    user_data = request.get_json()
    updated_user = UserService.update_user(user_id, user_data)
    if not updated_user:
        return jsonify({ 'error': 'User not found' }), 404
    return jsonify({ 'user': updated_user }), 200