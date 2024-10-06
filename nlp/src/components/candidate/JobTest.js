import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/JobTest.css';
import { FaUser, FaBriefcase, FaCog, FaSignOutAlt } from 'react-icons/fa';

const JobTest = () => {
  const location = useLocation();
  const { questions, jobId } = location.state || { questions: "", jobId: "" };

  // Récupération de l'ID du candidat depuis le localStorage
  const candidateId = localStorage.getItem('candidateId');

  const questionArray = typeof questions === 'string' ? questions.split('\n') : questions;
  const limitedQuestions = questionArray.slice(0, 3);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const totalQuestions = limitedQuestions.length;
  const [userAnswer, setUserAnswer] = useState('');
  const [similarities, setSimilarities] = useState([]);
  const [averageSimilarity, setAverageSimilarity] = useState(null);

  const handleSubmit = () => {
    const currentQuestion = limitedQuestions[currentQuestionIndex];
  
    fetch('http://localhost:5000/job_recommendations/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: currentQuestion,
        candidate_answer: userAnswer,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      setSimilarities((prev) => [...prev, data.similarity]);
  
      if (currentQuestionIndex === totalQuestions - 1) {
        const avg = (similarities.reduce((acc, val) => acc + val, 0) + data.similarity) / (similarities.length + 1);
        setAverageSimilarity(avg);
        alert('Vous avez terminé le test! Votre score est : ' + avg.toFixed(2));
  
        // Insérer le score dans la base de données après l'affichage du score
        fetch('http://localhost:5000/job_recommendations/insert_score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            candidate_id: candidateId, // ID du candidat
            offer_id: jobId,            // ID de l'offre
            score: avg.toFixed(2),      // Le score moyen
          }),
        })
        .then((insertResponse) => {
          if (insertResponse.ok) {
            console.log('Score inséré avec succès.');
          } else {
            console.error('Erreur lors de l\'insertion du score.');
          }
        })
        .catch((error) => {
          console.error('Erreur lors de l\'insertion du score:', error);
        });
        
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la soumission:', error);
    });
  
    setUserAnswer('');
  };
  
  return (
    <div className="d-flex vh-100">
      <nav className="sidebar">
        
        <ul className="menu">
          <li>
            <Link to="/profile">
              <FaUser className="icon" />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/consult-offers">
              <FaBriefcase className="icon" />
              <span>Consult Offers</span>
            </Link>
          </li>
         
          <li>
            <Link to="/logout">
              <FaSignOutAlt className="icon" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card shadow-lg border-0 custom-card" style={{ width: '100%', maxWidth: '1000px' }}>
          <div className="card-body text-center">
            {averageSimilarity === null ? (
              <>
                <h4 className="card-title text-primary">{`Question ${currentQuestionIndex + 1} / ${totalQuestions}`}</h4>
                <p className="card-text">{limitedQuestions[currentQuestionIndex]}</p>
                <div className="mb-4">
                  <textarea
                    className="form-control custom-textarea"
                    rows="6"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Entrez votre réponse (optionnel)"
                  />
                </div>
                <button className="btn btn-primary btn-lg custom-button" onClick={handleSubmit}>
                  Soumettre
                </button>
              </>
            ) : (
              <div className="mt-4">
                <h5>Votre score est : {averageSimilarity.toFixed(2)}</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTest;
