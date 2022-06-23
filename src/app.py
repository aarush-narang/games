from flask import Flask
from routes import main_router
import os

app = Flask(__name__)

app.register_blueprint(main_router.main_router, url_prefix='/')

if __name__ == '__main__':
    app.run(host=os.getenv('DOMAIN'), port=os.getenv('PORT'), ssl_context='adhoc', debug=True)