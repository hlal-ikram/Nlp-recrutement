from bson.objectid import ObjectId
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
import json
import os
from werkzeug.utils import secure_filename
from flask import send_from_directory

user_profile_bp = Blueprint('user_profile', __name__)

# Initialise Mongo ici
mongo = None

def init_mongo(mongo_instance):
    global mongo
    mongo = mongo_instance



# Get the current directory where app.py is located
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Moves up one level

# Configure the upload folder to be inside 'Backend/uploads'
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

CV_FOLDER = os.path.join(UPLOAD_FOLDER, 'cvs')

if not os.path.exists(CV_FOLDER):
    os.makedirs(CV_FOLDER)


def convert_object_id(document):
    if isinstance(document, dict):
        return {key: convert_object_id(value) for key, value in document.items()}
    elif isinstance(document, list):
        return [convert_object_id(item) for item in document]
    elif isinstance(document, ObjectId):
        return str(document)
    return document

@user_profile_bp.route('/candidate/<candidateId>', methods=['GET'])
def get_candidate_profile(candidateId):
    try:
        candidate = mongo.db.candidates.find_one({"_id": ObjectId(candidateId)})
        if not candidate:
            return jsonify({"message": "Candidate not found"}), 404

        # Supprimer les champs sensibles comme le mot de passe
        candidate.pop('password', None)

        # Convertir ObjectId en chaîne de caractères
        candidate = convert_object_id(candidate)

        return jsonify(candidate), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@user_profile_bp.route('/candidate/<candidateId>', methods=['PUT'])
def update_candidate_profile(candidateId):
    try:
        data = request.get_json()

        if '_id' in data:
            del data['_id']

        result = mongo.db.candidates.update_one(
            {"_id": ObjectId(candidateId)},
            {"$set": data}
        )

        if result.matched_count == 0:
            return jsonify({"message": "Candidate not found"}), 404
        if result.modified_count == 0:
            return jsonify({"message": "No changes made to the candidate profile"}), 200

        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

@user_profile_bp.route('/uploads/<path:filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


    

@user_profile_bp.route('/upload/<candidateId>', methods=['POST'])
def upload_profile_picture(candidateId):
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Store the correct relative URL with /profile/uploads/ prefix
        image_url = f"/profile/uploads/{filename}"
        mongo.db.candidates.update_one(
            {"_id": ObjectId(candidateId)},
            {"$set": {"profile_picture": image_url}}
        )

        return jsonify({"message": "Profile picture uploaded successfully!"}), 200
    

@user_profile_bp.route('/uploads/cv/<path:filename>', methods=['GET'])
def uploaded_cv_file(filename):
    return send_from_directory(CV_FOLDER, filename)

@user_profile_bp.route('/upload/cv/<candidateId>', methods=['POST'])
def upload_cv(candidateId):
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(CV_FOLDER, filename)
        file.save(file_path)

        # Store the CV path in the MongoDB collection
        cv_url = f"/profile/uploads/cv/{filename}"
        mongo.db.candidates.update_one(
            {"_id": ObjectId(candidateId)},
            {"$set": {"cv": cv_url}}
        )

        return jsonify({"message": "CV uploaded successfully!"}), 200