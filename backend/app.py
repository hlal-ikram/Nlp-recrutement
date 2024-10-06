from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from routes.auth import auth_bp, init_mongo as init_mongo_auth
from routes.job_offer import job_offer_bp, init_mongo as init_mongo_offer
from routes.register import register_bp, init_mongo as init_mongo_register 
from routes.user_profile import user_profile_bp, init_mongo as init_mongo_profile
from routes.job_recommendations import job_recommendations_bp, init_mongo as init_mongo_recommendations
from routes.jobadd import jobadd_bp, init_mongo as init_mongo_aoffer

from flask_cors import CORS

app = Flask(__name__)
app.config.from_pyfile('config.py')

# Initialize Mongo once
mongo = PyMongo(app)

CORS(app)

# Pass the Mongo instance to the blueprints
init_mongo_auth(mongo)
init_mongo_offer(mongo)
init_mongo_register(mongo)  
init_mongo_profile(mongo)
init_mongo_recommendations(mongo)
init_mongo_aoffer(mongo)
# Register the blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(job_offer_bp, url_prefix='/job_offer')
app.register_blueprint(jobadd_bp, url_prefix='/jobadd')
app.register_blueprint(register_bp, url_prefix='/register')  # Register the register blueprint
app.register_blueprint(user_profile_bp, url_prefix='/profile')  
app.register_blueprint(job_recommendations_bp, url_prefix='/job_recommendations')
if __name__ == '__main__':
    app.run(debug=True)
