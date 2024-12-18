from app import db

class Ingredient(db.Model):
    __tablename__ = 'Ingredients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    quantity = db.Column(db.Numeric(10, 2), nullable=True)
    unit = db.Column(db.String(20), nullable=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('Recipes.id'), nullable=False)

    def __repr__(self):
        return f'<Ingredient {self.id}, {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'quantity': float(self.quantity) if self.quantity is not None else None,  # Convert Decimal to float for JSON
            'unit': self.unit,
            'recipe_id': self.recipe_id
        }