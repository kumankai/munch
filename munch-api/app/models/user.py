from app.extensions import db

class User(db.Model):
    __tablename__ = 'Users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.id} {self.username}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password
        }