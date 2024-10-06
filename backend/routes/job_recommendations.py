#routes/job_recommendations.py
from flask import Blueprint, request, jsonify, current_app
from .utils import extract_text_from_pdf, parse_resume, encode_text, extract_features_from_json
from .recommender import recommend_jobs
from werkzeug.utils import secure_filename
import os
from .utils import generate_technical_questions
from .utils import generate_model_answer
from .utils import evaluate_answer
from tabulate import tabulate
from textwrap import wrap
from bson.objectid import ObjectId


job_recommendations_bp = Blueprint('job_recommendations', __name__)
mongo = None
similarities = []

# Fonction pour initialiser Mongo
def init_mongo(mongo_instance):
    global mongo
    mongo = mongo_instance

@job_recommendations_bp.route('/consult', methods=['POST'])
def upload_file():
    upload_folder = current_app.config['UPLOAD_FOLDER']
    
    if 'cv' not in request.files:
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400
    
    file = request.files['cv']
    
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400
    
    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        # Extraire le texte du PDF
        resume_text = extract_text_from_pdf(file_path)
        cv_json = parse_resume(resume_text)
        print("Parsed Resume:", cv_json)
        print("µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµ")

        # Obtenir les offres d'emploi depuis MongoDB
        job_offers = list(mongo.db.job_offers.find())  # Assurez-vous que job_offers est la collection correcte
        #print("Job Offers:", job_offers)
        # Obtenir les recommandations d'emploi
        recommended_jobs = recommend_jobs(cv_json, job_offers)
        print("µ111111111111111111111111µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµ1111111111111111111µ")
        print(" recommended_jobs:",  recommended_jobs)
        # Sérialiser les résultats
        serialized_jobs = [{'title': job['title'],'company_name' : job['company_name'] ,'requirements': job['requirements'], 'id': str(job['_id']),'description': job['description'],'salary':job['salary'],'location':job['location'], 'similarity': similarity} for job, similarity in recommended_jobs]

        return jsonify({'resume_text': resume_text, 'parsed_resume': cv_json, 'recommended_jobs': serialized_jobs}), 200
    else:
        return jsonify({'error': 'Format de fichier non valide. Seuls les fichiers PDF sont autorisés.'}), 400
    

@job_recommendations_bp.route('/generate_questions', methods=['POST'])
def generate_questions():
    data = request.get_json()

    job_description = data.get('job_description')
    resume_data = data.get('resume_data')

    if not job_description or not resume_data:
        return jsonify({'error': 'Job description or resume data is missing'}), 400

    # Vérifiez le format des données ici si nécessaire
    print("Job Description:", job_description)
    print("Resume Data:", resume_data)

    # Appelez votre fonction pour générer les questions
    technical_question = generate_technical_questions(resume_data, job_description)
    print("Questions Techniques Générées:", technical_question)
    technical_questions = [q.strip() for q in technical_question.split('\n') if q.strip()]
    print("Questions Techniques Générées:", technical_questions)
    return jsonify({'technical_questions': technical_questions})




@job_recommendations_bp.route('/evaluate', methods=['POST'])
def evaluate_response():
    

    global similarities  # Utiliser la liste globale pour stocker les similarités
    data = request.get_json()

    question = data.get('question')
    candidate_answer = data.get('candidate_answer', '')  # Par défaut, une chaîne vide si aucune réponse
    if not question:
        return jsonify({'error': 'La question est manquante'}), 400

    # Générer la réponse modèle pour la question
    model_answer = generate_model_answer(question)

    if candidate_answer.strip() == '':
        similarity = 0.00  # Pas de comparaison si aucune réponse
        candidate_answer = "Non répondu"  # Marque comme non répondu
    else:
        # Calculer la similarité entre la réponse du candidat et celle du modèle
        similarity = evaluate_answer(candidate_answer, model_answer)

    # Ajouter la similarité à la liste
    similarities.append(similarity)

    # Utiliser textwrap pour limiter la largeur des colonnes
    max_width = 30  # Limite de largeur des colonnes

    wrapped_question = "\n".join(wrap(question, max_width))
    wrapped_candidate_answer = "\n".join(wrap(candidate_answer, max_width))
    wrapped_model_answer = "\n".join(wrap(model_answer, max_width))
    wrapped_similarity = str(similarity)

    # Créer une seule ligne du tableau avec 4 colonnes
    result_table = [[wrapped_question, wrapped_candidate_answer, wrapped_model_answer, wrapped_similarity]]

    # Afficher le tableau dans le backend avec tabulate (4 colonnes)
    print(tabulate(result_table, headers=['Question', 'Réponse du Candidat', 'Réponse Modèle', 'Similarité'], tablefmt='grid'))

    return jsonify({'question': question, 'candidate_answer': candidate_answer, 'model_answer': model_answer, 'similarity': similarity}), 200




@job_recommendations_bp.route('/average_similarity', methods=['GET'])
def get_average_similarity():
    global similarities  # Utiliser la liste globale pour accéder aux similarités

    if similarities:  # Vérifier si la liste n'est pas vide
        average_similarity = sum(similarities) / len(similarities)
    else:
        average_similarity = 0.00
    print(similarities)
    return jsonify({'average_similarity': average_similarity}), 200

@job_recommendations_bp.route('/insert_score', methods=['POST'])
def insert_score():
    data = request.get_json()
    
    candidate_id = data.get('candidate_id')
    offer_id = data.get('offer_id')
    score = data.get('score')

    if not candidate_id or not offer_id or score is None:
        return jsonify({'error': 'Candidate ID, Offer ID or score is missing'}), 400

    # Insertion dans la collection 'test'
    mongo.db.test.insert_one({
        "candidate_id": ObjectId(candidate_id),
        "offer_id":  ObjectId(offer_id), 
        "score": float(score)  # Convertir le score en float
    })

    return jsonify({'message': 'Score inserted successfully'}), 200
