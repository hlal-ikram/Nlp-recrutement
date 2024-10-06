import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBriefcase, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/CandidatePage.css';

function CandidatePage() {
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
        <h1>Welcome Back!</h1>
        <p>Your personalized dashboard is ready. Explore and manage your profile, check job offers, and update your settings.</p>
      </main>
    </div>
  );
}

export default CandidatePage;
