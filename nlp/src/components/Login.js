import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/styles.css';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', {
        email,
        password
      });
      const userRole = response.data.message;
      const userId = response.data.id;

      if (userRole === 'Hello Candidate') {
        navigate('/candidate'); 
        localStorage.setItem('candidateId', userId); 
        console.log('candidateId:', localStorage.getItem('candidateId')); 
      } else if (userRole === 'Hello Recruiter') {
        localStorage.setItem('recruiterId', userId); // Stocker l'ID dans localStorage
        navigate('/recruiter'); 
      } else {
        setMessage('User not found');
      }
    } catch (error) {
      setMessage('Error logging in');
    }
  };

  return (
    <div className="user-registration">
      <div className="container register">
        <div className="row">
          <div className="col-md-3 register-left">
            <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt="" />
            <h3>Welcome back!</h3>
            <p> Access your account to continue.</p> 
            <a href="/" className="btnLogin">Register</a>
          </div>
          <div className="col-md-9 register-right">
            <h3 className="register-heading">Login</h3>
            <div className="row register-form">
              <div className="col-md-6">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <input type="submit" className="btnRegister btn btn-primary" value="Login" />
                </form>
                {message && <p>{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
