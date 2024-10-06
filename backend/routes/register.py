from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from datetime import datetime
from werkzeug.security import generate_password_hash

register_bp = Blueprint('register', __name__)

# Initialize MongoDB here
mongo = None

def init_mongo(mongo_instance):
    global mongo
    mongo = mongo_instance

@register_bp.route('/register/candidate', methods=['POST'])
def register_candidate():
    try:
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        phone = data.get('phone')
        resume_url = data.get('resume_url')
        password = data.get('password')

        # Check if the email already exists
        if mongo.db.candidates.find_one({"email": email}):
            return jsonify({"message": "Email already registered"}), 400

        candidate = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
            "resume_url": resume_url,
            "password": password,
            "profile_picture": "uploads/default.png",
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
           
        }

        # Insert into the candidates collection
        mongo.db.candidates.insert_one(candidate)
        return jsonify({"message": "Candidate registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@register_bp.route('/register/recruiter', methods=['POST'])
def register_recruiter():
    try:
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        phone = data.get('phone')
        company_name = data.get('company_name')
        password = data.get('password')

        # Check if the email already exists
        if mongo.db.recruiters.find_one({"email": email}):
            return jsonify({"message": "Email already registered"}), 400

        recruiter = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
            "company_name": company_name,
            "password": generate_password_hash(password),
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        # Insert into the recruiters collection
        mongo.db.recruiters.insert_one(recruiter)
        return jsonify({"message": "Recruiter registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
