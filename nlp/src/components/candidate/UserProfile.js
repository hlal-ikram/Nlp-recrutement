import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaBriefcase, FaCog, FaSignOutAlt ,FaPencilAlt} from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../styles/CandidatePage.css';
import '../../styles/UserProfile.css';

const CandidateProfile = () => {
  const [candidate, setCandidate] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [showCvModal, setShowCvModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [cvFile, setCvFile] = useState(null); 
  const candidateId = localStorage.getItem('candidateId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/profile/candidate/${candidateId}`);
        setCandidate(response.data);
      } catch (error) {
        console.error("Error fetching profile", error);
        alert("Error fetching profile: " + error.message);
      }
    };

    fetchProfile();
  }, [candidateId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCandidate(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/profile/candidate/${candidateId}`, candidate);
      setShowProfileModal(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const handleUploadPicture = async () => {
    if (!imageFile) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      await axios.post(`http://127.0.0.1:5000/profile/upload/${candidateId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile picture uploaded successfully!');
      setShowPictureModal(false);
      // Fetch updated profile to include the new image
      const response = await axios.get(`http://127.0.0.1:5000/profile/candidate/${candidateId}`);
      setCandidate(response.data);
    } catch (error) {
      console.error('Error uploading profile picture', error);
    }
  };

  // Upload CV
  const handleUploadCv = async () => {
    if (!cvFile) {
      alert('Please select a CV to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', cvFile);

    try {
      await axios.post(`http://127.0.0.1:5000/profile/upload/cv/${candidateId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('CV uploaded successfully!');
      setShowCvModal(false);

      // Fetch updated profile to include the new CV link
      const response = await axios.get(`http://127.0.0.1:5000/profile/candidate/${candidateId}`);
      setCandidate(response.data);
    } catch (error) {
      console.error('Error uploading CV', error);
    }
  };

  const handleProfileModalClose = () => setShowProfileModal(false);
  const handleProfileModalShow = () => setShowProfileModal(true);

  const handlePictureModalClose = () => {
    setShowPictureModal(false);
    setImageFile(null); // Reset image file when closing the modal
  };
  const handlePictureModalShow = () => setShowPictureModal(true);

  const handleCvModalClose = () => {
    setShowCvModal(false);
    setCvFile(null);
  };
  const handleCvModalShow = () => setShowCvModal(true);

  return (
    <div className="candidate-page">
      <nav className="sidebar">
       
        <ul className="menu">
          <li><Link to="/profile"><FaUser className="icon" /> Profile</Link></li>
          <li><Link to="/consult-offers"><FaBriefcase className="icon" /> Consult Offers</Link></li>
         
          <li><Link to="/logout"><FaSignOutAlt className="icon" /> Logout</Link></li>
        </ul>
      </nav>
      
 <div className="content">
  <div className="profile-header d-flex align-items-center justify-content-end">
    <h1 className="me-3">{candidate.first_name} {candidate.last_name}</h1>
    <div className="profile-picture-container position-relative">  
      <img 
        src={`http://127.0.0.1:5000${candidate.profile_picture}` || 'uploads/default.png'} 
        alt="Profile"  
        className="profile-picture rounded-circle"
      />
     
     <Button className="edit-button position-absolute bottom-10 start-99 translate-middle-x btn btn-light btn-sm"onClick={handlePictureModalShow}><FaPencilAlt /> </Button>
    </div>
  </div>



        
        <div className="card">
          <div className="card-body profile-info">
            <div className="info-text">
              <p className="card-text">Email: {candidate.email}</p>
              <p className="card-text">Phone: {candidate.phone}</p>
              <p className="card-text">Address: {candidate.adresse}</p>
            </div>
            <Button className="edit-btn" onClick={handleProfileModalShow}>{'>'}</Button>
          </div>
        </div>

        <div className="cv-upload-section mt-4 p-3 border rounded bg-light">
  <h3 className="d-flex align-items-center">
    <i className="fas fa-file-alt me-2 text-primary"></i> CV
  </h3>
  <hr />
  {candidate.cv ? (
    <p className="mb-3">
      <a href={`http://127.0.0.1:5000${candidate.cv}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-success">
        <i className="fas fa-file-pdf me-2"></i> View Uploaded CV
      </a>
    </p>
  ) : (
    <p className="text-muted mb-3">
      <i className="fas fa-exclamation-circle me-2"></i> No CV uploaded yet.
    </p>
  )}
  <div className="d-flex justify-content-end">
  <Button 
  className="btn btn-primary d-flex align-items-center justify-content-center px-4 py-2" 
  onClick={handleCvModalShow}
  style={{
    backgroundColor: '#6c757d', // Gray background color
    borderColor: '#6c757d',    
    borderRadius: '25px', 
    fontWeight: 'bold',
   
  }}
>
  <i className="fas fa-file-upload me-2"></i> {/* Changed icon to fa-file-upload */}
  Upload CV
</Button>

  </div>
</div>


        {/* Modal for updating profile information */}
        <Modal show={showProfileModal} onHide={handleProfileModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" name="email" value={candidate.email || ''} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" placeholder="Enter phone" name="phone" value={candidate.phone || ''} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Enter address" name="adresse" value={candidate.adresse || ''} onChange={handleInputChange} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleProfileModalClose}>Close</Button>
            <Button variant="primary" onClick={handleUpdateProfile}>Save Changes</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for uploading profile picture */}
        <Modal show={showPictureModal} onHide={handlePictureModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Profile Picture</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Choose File</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>
              <Button variant="primary" onClick={handleUploadPicture}>
                Upload
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
         {/* CV Upload Modal */}
      <Modal show={showCvModal} onHide={handleCvModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload CV</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFileCv">
            <Form.Label>Select CV file</Form.Label>
            <Form.Control type="file" onChange={handleCvChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCvModalClose}>Close</Button>
          <Button variant="primary" onClick={handleUploadCv}>Upload CV</Button>
        </Modal.Footer>
      </Modal>

      </div>
    </div>
  );
};

export default CandidateProfile;
