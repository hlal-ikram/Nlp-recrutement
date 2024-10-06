import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import CandidatePage from './components/candidate/CandidatePage';
import RecruiterPage from './components/recruiter/RecruiterPage';
import AddOfferPage from './components/recruiter/AddOfferPage';
import UserProfile from './components/candidate/UserProfile';
import TestResultsPage from './components/recruiter/TestResultsPage'; // Importez la page des résultats des tests
import ConsultOffers from './components/candidate/ConsultOffers';
import JobTest from './components/candidate/JobTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/candidate" element={<CandidatePage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/add-offer" element={<AddOfferPage />} />
        <Route path="/test-results" element={<TestResultsPage />} />
        <Route path="/consult-offers" element={<ConsultOffers />} />
        <Route path="/job-test" element={<JobTest />} />
      </Routes>
    </Router>
  );
}

export default App;
