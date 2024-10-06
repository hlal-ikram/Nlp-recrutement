from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

# Mongo instance will be set through this function
mongo = None

def init_mongo(mongo_instance):
    global mongo
    mongo = mongo_instance

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    # Vérifie dans la collection des candidats
    candidate = mongo.db.candidates.find_one({'email': email})
    if candidate and candidate['password'] == password:
        return jsonify({'message': 'Hello Candidate', 'id': str(candidate['_id'])}), 200

    # Vérifie dans la collection des recruteurs
    recruiter = mongo.db.recruiters.find_one({'email': email})
    if recruiter and recruiter['password'] == password:
        return jsonify({'message': 'Hello Recruiter', 'id': str(recruiter['_id'])}), 200

    return jsonify({'message': 'User not found'}), 404
