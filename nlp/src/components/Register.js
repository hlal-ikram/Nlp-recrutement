import React, { useState } from 'react';
import { Tabs, Tab, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const Register = () => {
  // État pour gérer l'onglet actif
  const [key, setKey] = useState('candidate');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    resume_url: '',  // This is for candidates
    company_name: '' // This is for recruiters
  });

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const endpoint = key === 'candidate' ? '/register/register/candidate' : '/register/register/recruiter';
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert(`${key.charAt(0).toUpperCase() + key.slice(1)} registered successfully`);
      } else {
        alert(result.message || 'Failed to register');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };
  

  // Texte d'introduction en fonction de l'onglet actif
  const getIntroText = () => {
    switch (key) {
      case 'candidate':
        return 'Your next career opportunity is just a few steps away. Register now to get started!';
      case 'recruiter':
        return 'Ready to find the best talent? Register now to start hiring!';
      default:
        return '';
    }
  };

  return (
    <div className="user-registration">
      <div className="container register">
        <div className="row">
          <div className="col-md-3 register-left">
            <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt=""/>
            <h3>Welcome</h3>
            <p>{getIntroText()}</p>
            <a href="/login" className="btnLogin">Login</a><br/>
          </div>
          <div className="col-md-9 register-right">
            <Tabs
              defaultActiveKey="candidate"
              id="myTab"
              className="nav-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)} // Met à jour l'état lorsqu'un onglet est sélectionné
            >
              <Tab eventKey="candidate" title="Candidate">
                <h3 className="register-heading">Register as a Candidate</h3>
                <Form onSubmit={handleSubmit}>
                  <div className="row register-form">
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="first_name"
                          placeholder="First Name *"
                          onChange={handleInputChange}
                          value={formData.first_name}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="last_name"
                          placeholder="Last Name *"
                          onChange={handleInputChange}
                          value={formData.last_name}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Password *"
                          onChange={handleInputChange}
                          value={formData.password}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="password"
                          placeholder="Confirm Password *"
                          required
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Your Email *"
                          onChange={handleInputChange}
                          value={formData.email}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="phone"
                          placeholder="Your Phone *"
                          maxLength="10"
                          minLength="10"
                          onChange={handleInputChange}
                          value={formData.phone}
                          required
                        />
                      </Form.Group>
                     
                      <Button className="btnRegister" variant="primary" type="submit">
                        Register
                      </Button>
                    </div>
                  </div>
                </Form>
              </Tab>
              <Tab eventKey="recruiter" title="Recruiter">
                <h3 className="register-heading">Register as a Recruiter</h3>
                <Form onSubmit={handleSubmit}>
                  <div className="row register-form">
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="first_name"
                          placeholder="First Name *"
                          onChange={handleInputChange}
                          value={formData.first_name}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="last_name"
                          placeholder="Last Name *"
                          onChange={handleInputChange}
                          value={formData.last_name}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="company_name"
                          placeholder="Company Name *"
                          onChange={handleInputChange}
                          value={formData.company_name}
                          required
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Email *"
                          onChange={handleInputChange}
                          value={formData.email}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          name="phone"
                          placeholder="Phone *"
                          maxLength="10"
                          minLength="10"
                          onChange={handleInputChange}
                          value={formData.phone}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Password *"
                          onChange={handleInputChange}
                          value={formData.password}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          type="password"
                          placeholder="Confirm Password *"
                          required
                        />
                      </Form.Group>
                      <Button className="btnRegister" variant="primary" type="submit">
                        Register
                      </Button>
                    </div>
                  </div>
                </Form>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
