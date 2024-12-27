import hashlib

def hash_password(password):
    hashed_pwd = hashlib.sha256()
    hashed_pwd.update(password.encode())
    return hashed_pwd.hexdigest()