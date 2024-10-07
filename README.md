# 🌟 NLP Recrutement 🌟

![NLP Recrutement](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📚 Table des matières
- [Description](#✨-description)
- [Fonctionnalités](#🔥-fonctionnalités)
- [Technologies utilisées](#⚙️-technologies-utilisées)
- [Installation](#📦-installation)
- [Utilisation](#🚀-utilisation)
- [Contact](#📞-contact)
---

## ✨ Description
**NLP Recrutement** est une application innovante qui utilise le traitement du langage naturel (NLP) pour faciliter le processus de recrutement. Ce système permet aux recruteurs de créer des offres d'emploi et aux candidats de soumettre leur CV. L'application calcule la similarité entre les CVs et les offres d'emploi, permettant ainsi d'optimiser le processus de sélection.

---

## 🔥 Fonctionnalités
- **Création d'offres d'emploi** : Les recruteurs peuvent créer des offres avec des détails comme la description, le salaire et les compétences requises.
- **Soumission de CV** : Les candidats peuvent télécharger leur CV pour postuler aux offres.
- **Calcul de similarité** : 
  - **Méthode** : Utilise le modèle **BERT** pour encoder le texte des CVs et des offres d'emploi, puis calcule la similarité cosinus.
  - **Outil** : `sklearn` pour la similarité cosinus.
- **Tests pour les candidats** : 
  - **Méthode** : Génération de questions techniques en utilisant le modèle **Llama** pour formuler des questions basées sur les CVs et les descriptions de poste.
  - **Outil** : API **Groq** pour générer des questions et des réponses.

---


## ⚙️ Technologies utilisées
- **Frontend** : React
- **Backend** : Flask
- **Base de données** : MongoDB
- **NLP** : Utilisation de modèles NLP pour l'analyse des CVs et des offres.
  - **Encodage de texte** : **BERT** pour encoder les CVs et les offres d'emploi.
  - **Extraction d'informations** : API **Groq** avec le modèle **Llama** pour parser les CVs et générer des questions.
  - **Évaluation des réponses** : Calcul de la similarité cosinus pour évaluer les réponses des candidats par rapport aux réponses modèles.

---

## 📦 Installation
1. **Clonez le dépôt** :
   ```bash
   git clone https://github.com/hlal-ikram/Nlp-recrutement.git
2. **Accédez au répertoire du projet** :
    ```bash
    cd Nlp-recrutement
3. **Installez les dépendances**:
    - ### Pour le frontend :
     ```bash
     cd nlp
     npm install
     ```
    - ### Pour le backend :
     ```bash
     cd backend
     pip install -r requirements.txt
     ```
4. **Démarrez l'application**:

   - ### Frontend :
   ```bash
   npm start
   ```
   - ### Backend :
   ```bash
   python app.py
   ```
## 🚀 Utilisation
- Accédez à l'interface utilisateur via votre navigateur à l'adresse http://localhost:3000.
- Inscrivez-vous ou connectez-vous en tant que recruteur ou candidat.
- Créez des offres d'emploi ou soumettez votre CV pour postuler.
- Visualisez les résultats de similarité et passez des tests.

## 📞 Contact
Hlal Ikram  
Email: hlal00ikram@gmail.com  
GitHub: [hlal-ikram](https://github.com/hlal-ikram)



