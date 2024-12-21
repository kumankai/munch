from flask import current_app
from app.models.token_blacklist import TokenBlacklist

def register_jwt_callbacks(jwt):
    # Register all JWT callbacks
    
    @jwt.token_in_blocklist_loader
    def check_if_token_in_blacklist(jwt_header, jwt_payload):
        jti = jwt_payload['jti']
        return TokenBlacklist.query.filter_by(jti=jti).first() is not None

    @jwt.decode_key_loader
    def get_key_for_token(jwt_header, jwt_payload):
        # Check if it's a refresh token
        if jwt_header.get('kid') == 'refresh':
            return current_app.config['JWT_REFRESH_TOKEN_SECRET_KEY']
        # Default to access token key
        return current_app.config['JWT_ACCESS_TOKEN_SECRET_KEY']
        
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {'error': 'Invalid token'}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'error': 'Token has expired'}, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {'error': 'Authorization token is missing'}, 401 