from app.models.token_blacklist import TokenBlacklist
from datetime import datetime, timezone
from app.extensions import db

class TokenService:
    @staticmethod
    def create_tokens(user_id: str) -> dict:
        pass

    @staticmethod
    def blacklist_tokens(access_token, refresh_token) -> tuple:
        pass

    @staticmethod
    def blacklist(token: str):
        pass

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