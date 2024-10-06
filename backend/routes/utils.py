# routes/utils.py

import PyPDF2
import json
import re
from groq import Groq
import torch
from transformers import BertTokenizer, BertModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Initialize Groq client
llama_70B = "llama-3.1-70b-versatile"
client = Groq(api_key="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")

# Load BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

def encode_text(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    outputs = model(**inputs)
    # Utiliser le vecteur [CLS]
    return outputs.last_hidden_state[:, 0, :].detach().numpy()[0]

def parse_resume(resume_text):
    prompt = f"""
    Parse the following resume and extract only the specified information in the exact JSON format provided...
    {resume_text}
     Required JSON format:
    {{
      "Name": "",
      "Email": "",
      "Phone-Number": "",
      "Summary": "",
      "Current-Location": "",
      "Current-Company": "",
      "Skills": [],
      "Linkedin-Id": "",
      "Github-Id": "",
      "Total-Experience": 0,
      "Education": [
        {{
          "Degree": "",
          "Specialization": "",
          "Institute": "",
          "Start": 0,
          "End": 0
        }}
      ],
      "Education-Year": [],
      "Experiences": [
        {{
          "Company Name": "",
          "Designation": "",
          "Start": "",
          "End": "",
          "Description": ""
        }}
      ],
      "Projects": [
        {{
          "Project": "",
          "Project-Description": ""
        }}
      ],
      "Roles-Responsibility": [],
      "Certifications": []
    }}
    """
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=llama_70B,
        temperature=0
    )
    response = chat_completion.choices[0].message.content
    json_match = re.search(r'```json\n(.*?)\n```', response, re.DOTALL)
    if json_match:
        json_str = json_match.group(1)
        return json.loads(json_str)
    return None

def extract_text_from_pdf(pdf_file):
    try:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        return ""

def extract_features_from_json(cv_json):
    cv_text = ""
    cv_text += " ".join(cv_json["Skills"]) + " "
    
    for edu in cv_json["Education"]:
        cv_text += edu["Degree"] + " " + edu["Specialization"] + " " 

    return cv_text

def generate_technical_questions(resume_data, job_description):
    prompt =f"""
    Based on the following job description and candidate's resume, generate only technical interview questions. If specific details are missing, focus purely on general technical competencies related to the field, but do not mention the lack of information in the generated questions.

    Job Description:
      {job_description}

    Candidate's Resume:
      {json.dumps(resume_data, indent=2)}

    Provide only technical questions, formatted as follows:
    1. Technical Question 1
    2. Technical Question 2
    ...
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model=llama_70B,
            temperature=0.7
        )

        response = chat_completion.choices[0].message.content
        return response.strip()
    except Exception as e:
        return f"Erreur lors de l'appel à l'API pour générer les questions techniques : {e}"

# Fonction pour générer une réponse modèle pour une question
def generate_model_answer(question):
    prompt = f"""
    Provide a high-quality answer for the following interview question:

    Question:
    {question}

    Provide the answer:
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model=llama_70B,
            temperature=0.7
        )

        response = chat_completion.choices[0].message.content
         # Normalisation des questions
        cleaned_response = re.sub(r'\n\s*\n', '\n', response)  # Supprime les lignes vides
        cleaned_response = re.sub(r'\n+', '\n', cleaned_response)  # Supprime les sauts de ligne supplémentaires
        return response.strip()
    except Exception as e:
        return f"Erreur lors de l'appel à l'API pour générer la réponse modèle : {e}"


def evaluate_answer(candidate_response, model_answer):
    # Initialiser le vecteuriseur TF-IDF
    vectorizer = TfidfVectorizer()
    
    # Créer une matrice TF-IDF pour les réponses
    tfidf_matrix = vectorizer.fit_transform([candidate_response, model_answer])
    
    # Calculer la similarité cosinus
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    
    # Convertir la similarité en pourcentage
    return round(similarity[0][0] * 100, 2)
