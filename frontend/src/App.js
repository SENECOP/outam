import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* Page affichée par défaut */}
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
