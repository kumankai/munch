from app.models.user import User
from app.utils.hash_helper import hash_password
import hashlib

def check_username(username: str) -> bool:
    usernames = [user[0] for user in User.query.with_entities(User.username).all()]
    return username in usernames

def check_password(password: str, input_password: str) -> bool:
    hashed_input = hash_password(input_password)
    return password == hashed_input