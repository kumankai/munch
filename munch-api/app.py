from flask import Flask
from routes.recipes import recipes
from routes.user import user

app = Flask(__name__)

app.register_blueprint(recipes, url_prefix='/api')
app.register_blueprint(user, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
