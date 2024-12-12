from routes.user import user
from flask import request, jsonify

@user.route('/user/register', methods=['POST'])
def register():
    data = request.get_json()
    return jsonify({ 'data': data })