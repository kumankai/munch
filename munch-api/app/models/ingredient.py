from app import db

class Recipe(db.Model):
    __tablename__ = 'Recipes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(64), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)

    def __repr__(self):
        return f'<Recipe {self.id}, {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'instructions': self.instructions,
            'author': self.author,
            'image_url': self.image_url,
            'user_id': self.user_id
        }