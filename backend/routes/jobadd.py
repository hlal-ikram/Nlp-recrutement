from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from datetime import datetime, timezone


jobadd_bp = Blueprint('jobadd', __name__)

# Initialise mongo ici
mongo = None

def init_mongo(mongo_instance):
    global mongo
    mongo = mongo_instance




@jobadd_bp.route('/addoffer', methods=['POST'])
def addoffer():
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        recruiter_id = data.get('recruiter_id')

        # Vérifie si le recruteur existe
        recruiter = mongo.db.recruiters.find_one({"_id": ObjectId(recruiter_id)})
        if not recruiter:
            return jsonify({"message": "Recruiter not found"}), 404

        new_offer = {
            "title": data['title'],
            "description": data['description'],
            "requirements": data['requirements'],
            "salary": data['salary'],
            "posted_by": ObjectId(recruiter_id),
            "created_at": datetime.now(timezone.utc)
        }

        # Insère la nouvelle offre dans MongoDB
        mongo.db.job_offers.insert_one(new_offer)

        return jsonify({"message": "Job offer added successfully"}), 201
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 400