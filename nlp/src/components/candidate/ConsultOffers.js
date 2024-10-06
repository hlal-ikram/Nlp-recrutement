import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Remplacer useHistory par useNavigate
import { FaUser, FaBriefcase, FaCog, FaSignOutAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/CandidatePage.css';

function ConsultOffers() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [error, setError] = useState('');
  const [resumeText, setResumeText] = useState('');
  const navigate = useNavigate(); // Utiliser useNavigate pour la navigation

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('cv', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/job_recommendations/consult', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.recommended_jobs) {
        setJobOffers(response.data.recommended_jobs);
        setResumeText(response.data.resume_text || '');
        setError('');
      } else {
        setError('Aucune offre recommandée trouvée.');
      }
    } catch (error) {
      setError('Erreur lors du téléchargement du fichier ou du calcul de similarité.');
    }
  };

  const handleApply = async (offer) => {
    try {
        const response = await axios.post('http://localhost:5000/job_recommendations/generate_questions', {
            job_description: offer.description,
            resume_data: resumeText,
        });

        console.log(response.data); // Vérifiez ici
        if (response.data.technical_questions) {
            navigate('/job-test', { state: { questions: response.data.technical_questions,  jobId: offer.id  } });
        } else {
            setError('Erreur lors de la génération des questions.');
        }
    } catch (error) {
        setError('Erreur lors de la génération des questions.');
    }
};


  return (
    <div className="candidate-page">
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

      <main className="content">
        <div className="container mt-5">
          <h2 className="text-center mb-4">Consulter les Offres d'Emploi</h2>

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="form-group">
              <label htmlFor="cv">Téléchargez votre CV (PDF uniquement) :</label>
              <input 
                type="file" 
                id="cv" 
                className="form-control-file"
                accept=".pdf" 
                onChange={handleFileChange} 
              />
            </div>
            <button type="submit" className="btn btn-primary">Consulter les Offres</button>
          </form>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          {jobOffers.length > 0 && (
            <div className="job-offers">
              <h3>Offres d'emploi recommandées :</h3>
              <div className="row">
                {jobOffers.map((offer, index) => (
                  <div key={index} className="col-md-4">
                    <div className="card mb-4">
                      <div className="card-body">
                        <h4 className="card-title">{offer.title}</h4>
                        <p className="card-text"><strong>Compétences requises :</strong> {offer.requirements || 'Pas d’exigences spécifiées'}</p>
                        <p className="card-text"><strong>Entreprise :</strong> {offer.company_name}</p>
                        <p className="card-text"><strong>Description :</strong> {offer.description}</p>
                        <p className="card-text"><strong>Salaire :</strong> {offer.salary} $</p>
                        <p className="card-text"><strong>Localisation :</strong> {offer.location}</p>
                        
                        <button 
                          className="btn btn-success" 
                          onClick={() => handleApply(offer)}
                        >
                          Postuler
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ConsultOffers;
