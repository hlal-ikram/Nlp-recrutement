import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaPlus, FaList, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/RecruiterPage.css';

function RecruiterPage() {
  const [recruiterId, setRecruiterId] = useState('');

  useEffect(() => {
    // Récupérer l'ID du recruteur depuis localStorage
    const id = localStorage.getItem('recruiterId');
    if (id) {
      setRecruiterId(id);
    }
  }, []);

  return (
    <div className="recruiter-page">
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
        <header className="header">
          <h2>Welcome Back!</h2>
          <p>Manage your profile, offers, and test results efficiently.</p>
        </header>
        <section className="dashboard-overview">
          <div className="card">
            <h3>Profile</h3>
            <p>View and update your profile details.</p>
          </div>
          <div className="card">
            <h3>Add New Offer</h3>
            <p>Create and publish new job offers.</p>
            <p>Recruiter ID: {recruiterId}</p> {/* Afficher l'ID du recruteur */}
          </div>
          <div className="card">
            <h3>View Offers</h3>
            <p>Browse and manage existing job offers.</p>
          </div>
          <div className="card">
            <h3>Test Results</h3>
            <p>Analyze the results of candidate tests.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RecruiterPage;
