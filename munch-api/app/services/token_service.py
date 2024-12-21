from flask_jwt_extended import create_access_token, create_refresh_token, decode_token
from app.models.token_blacklist import TokenBlacklist
from datetime import datetime, timezone
from app.extensions import db
from typing import Optional

class TokenService:
    @staticmethod
    def create_tokens(user_id: str) -> dict:
        try:
            access_token = create_access_token(identity=user_id)
            refresh_token = create_refresh_token(
                identity=user_id,
                additional_claims={'type': 'refresh'}
            )
            
            return {
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        except Exception as e:
            print(f"Token creation error: {str(e)}")
            raise
    
    @staticmethod
    def refresh_access_token(user_id: str, old_access_token: str = None) -> Optional[dict]:
        try:
            # Blacklist old access token if provided
            if old_access_token:
                TokenService.blacklist(old_access_token)

            new_access_token = create_access_token(identity=user_id)
            return {'access_token': new_access_token}
        
        except Exception as e:
            print(f"Token refresh error: {str(e)}")
            return None

    @staticmethod
    def blacklist_tokens(access_token, refresh_token) -> Optional[bool]:
        try:
            res1 = TokenService.blacklist(access_token)
            res2 = TokenService.blacklist(refresh_token)
            if not res1 or not res2:
                return False
            return True
        except Exception as e:
            print(f"Token blacklisting error: {str(e)}")
            raise

    @staticmethod
    def blacklist(token: str) -> bool:
        try:
            blacklist = TokenBlacklist(
                jti=token['jti'],
                expires_at=datetime.fromtimestamp(token['exp'], tz=timezone.utc)
            )
            db.session.add(blacklist)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Token blacklisting error: {str(e)}")
            db.session.rollback()
            return False

    @staticmethod
    def cleanup_expired_tokens() -> int:
        try:
            count = TokenBlacklist.query.filter(
                TokenBlacklist.expires_at < datetime.now(timezone.utc)
            ).delete()
            db.session.commit()
            return count
        except Exception as e:
            print(f"Cleanup error: {str(e)}")
            db.session.rollback()
            return 0