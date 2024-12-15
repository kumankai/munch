from app.routes.user import user
from flask import request, jsonify
from app.services.user_service import UserService

user_service = UserService()

@user.route('/user/<int:user_id>', methods=['GET'])
def about(user_id):
    user = user_service.get_user_by_user_id(user_id)
    return jsonify({ 'user': user })

@user.route('/user/delete/<int:user_id>', methods=['DELETE'])
def delete(user_id):
    user_service.delete_user(user_id)
    return jsonify({ 'message': 'User deleted successfully' })

@user.route('/user/update', methods=['PUT'])
def update():
    user_data = request.get_json()
    new_user = user_service.update_user(user_data)
    return jsonify({ 'user': new_user })

@user.route('/user/all', methods=['GET'])
def all():
    return user_service.get_all_users()