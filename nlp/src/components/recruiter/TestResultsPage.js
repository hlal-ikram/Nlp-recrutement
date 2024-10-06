import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaPlus, FaList, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/TestResultsPage.css';

function TestResultsPage() {
  const [jobOffers, setJobOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recruiterId = localStorage.getItem('recruiterId');

  useEffect(() => {
    if (!recruiterId) {
      setError('No recruiterId found in localStorage');
      return;
    }

    const fetchJobOffers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:5000/job_offer/jobOffers?recruiterId=${recruiterId}`);
        const offers = await response.json();

        if (!response.ok) {
          setError(offers.message || 'Failed to fetch job offers');
        } else {
          setJobOffers(offers);
          setError(null);
        }
      } catch (err) {
        setError('An error occurred while fetching job offers');
      } finally {
        setLoading(false);
      }
    };

    fetchJobOffers();
  }, [recruiterId]);

  const handleConsult = async (offerId) => {
    setLoading(true);
    setSelectedOfferId(offerId);
    setShowResults(true);

    try {
      const response = await fetch(`http://127.0.0.1:5000/job_offer/testResults/${offerId}`);
      const results = await response.json();

      if (!response.ok) {
        setError(results.message || 'Failed to fetch test results');
      } else {
        setTestResults(results);
        setError(null);
      }
    } catch (err) {
      setError('An error occurred while fetching test results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-results-page">
      <nav className="sidebar">
        <ul className="menu">
          <li>
            <Link to="/add-offer">
              <FaPlus className="icon" />
              <span>Add Offer</span>
            </Link>
          </li>
          <li>
            <Link to="/test-results">
              <FaChartBar className="icon" />
              <span>Test Results</span>
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
        <h1>Job Offers and Test Results</h1>

        {error && <p className="error-message">{error}</p>}

        {loading && <p className="loading-message">Loading...</p>}

        {!loading && jobOffers.length > 0 ? (
          jobOffers.map((offer) => (
            <div key={offer._id} className="offer">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <button onClick={() => handleConsult(offer._id)}>Consult Test Results</button>

              {showResults && selectedOfferId === offer._id && (
                <div className="results">
                  <h4>Test Results for: {offer.title}</h4>

                  {testResults.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testResults.map((result) => (
                          <tr key={result._id}>
                            <td>{result.first_name}</td>
                            <td>{result.last_name}</td>
                            <td>{result.email}</td>
                            <td>{result.phone}</td>
                            <td>{result.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No test results found for this offer.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No job offers found.</p>
        )}
      </main>
    </div>
  );
}

export default TestResultsPage;
