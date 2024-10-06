import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaPlus, FaList, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/AddOfferPage.css';

function AddOfferPage() {
  const [recruiterId, setRecruiterId] = useState('');

  useEffect(() => {
    // Récupérer l'ID du recruteur depuis localStorage
    const id = localStorage.getItem('recruiterId');
    if (id) {
      setRecruiterId(id);
    }
  }, []);

  const handleAddOffer = async (event) => {
    event.preventDefault();
    // Collect data from form
    const formData = new FormData(event.target);
    const offerData = {
      title: formData.get('title'),
      description: formData.get('description'),
      requirements: formData.get('requirements'),
      salary: formData.get('salary'),
      recruiter_id: recruiterId,
    };

    try {
      // Replace with your backend URL
      const response = await fetch('http://localhost:5000/jobadd/addoffer', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Offer added successfully');
      } else {
        alert(result.message || 'Failed to add offer');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  return (
    <div className="add-offer-page">
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
          <h2>Add New Offer</h2>
          <p>Use the form below to add a new job offer.</p>
        </header>
        <section className="offer-form">
          <form onSubmit={handleAddOffer}>
            <div className="form-group">
              <label htmlFor="title">Offer Title</label>
              <input type="text" id="title" name="title" placeholder="Enter offer title" required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Offer Description</label>
              <textarea id="description" name="description" placeholder="Enter offer description" required />
            </div>
            <div className="form-group">
              <label htmlFor="requirements">Requirements</label>
              <textarea id="requirements" name="requirements" placeholder="Enter requirements" required />
            </div>
            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <input type="number" id="salary" name="salary" placeholder="Enter salary" required />
            </div>
            <button type="submit" className="btn-submit">Add Offer</button>
          </form>
          
        </section>
      </main>
    </div>
  );
}

export default AddOfferPage;
