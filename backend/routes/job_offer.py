from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

job_offer_bp = Blueprint('job_offer', __name__)

# Assurez-vous que mongo est bien initialisé avant d'utiliser ce blueprint
mongo = None

def init_mongo(mongo_instance):
    global mongo
    mongo = mongo_instance

@job_offer_bp.route('/jobOffers', methods=['GET'])
def get_job_offers():
    recruiter_id = request.args.get('recruiterId')
    if not recruiter_id:
        return jsonify({"message": "Recruiter ID is required"}), 400

    try:
        recruiter_object_id = ObjectId(recruiter_id)
    except Exception:
        return jsonify({"message": "Invalid recruiter ID format"}), 400

    job_offers = list(mongo.db.job_offers.find({"posted_by": recruiter_object_id}))

    # Convertir ObjectId en string
    for offer in job_offers:
        offer["_id"] = str(offer["_id"])
        if 'posted_by' in offer:
            offer['posted_by'] = str(offer['posted_by'])  # Exemple d'un autre champ

    if not job_offers:
        return jsonify({"message": "No job offers available."}), 200

    return jsonify(job_offers), 200

@job_offer_bp.route('/testResults/<offer_id>', methods=['GET'])
def get_test_results(offer_id):
    print(f"Received offer ID: {offer_id}")
    try:
        offer_object_id = ObjectId(offer_id)
    except Exception as e:
        print(f"Error converting offer ID: {e}")
        return jsonify({"message": "Invalid offer ID format"}), 400

    test_results = list(mongo.db.test.find({"offer_id": offer_object_id}))
    print(f"Test results found: {test_results}")

    candidates_with_scores = []
    for result in test_results:
        candidate_id = result['candidate_id']
        print(f"Candidate ID from result: {candidate_id}")

        try:
            candidate_object_id = ObjectId(candidate_id)  
            candidate = mongo.db.candidates.find_one({"_id": candidate_object_id})
            print(f"Candidate data: {candidate}")  # Ajouté pour débogage

            if candidate:
                candidates_with_scores.append({
                    "_id": str(candidate["_id"]),
                    "first_name": candidate.get("first_name", ""),
                    "last_name": candidate.get("last_name", ""),
                    "email": candidate.get("email", ""),
                    "phone": candidate.get("phone", ""),
                    "score": result["score"]
                })
            else:
                print(f"No candidate found for ID: {candidate_id}")
        except Exception as e:
            print(f"Invalid candidate ID format: {candidate_id} - Error: {e}")

    if not candidates_with_scores:
        print(f"No candidates found for offer ID: {offer_object_id}")
        return jsonify({"message": "No test results found for this offer"}), 200

    return jsonify(candidates_with_scores), 200
