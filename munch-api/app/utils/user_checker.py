from app.models.user import User
import hashlib

def check_username(username: str) -> bool:
    usernames = [user[0] for user in User.query.with_entities(User.username).all()]
    return username in usernames

def check_password(password: str, input_password: str) -> bool:
    hashed_input = hashlib.sha256()
    hashed_input.update(input_password.encode())
    return password == hashed_input.hexdigest()