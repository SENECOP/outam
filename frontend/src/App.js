import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PageScanner from './pages/PageScanner';
import PageClient from './pages/PageClient';
import BackOffice from './pages/BackOffice';
import RestaurantDashboard from './pages/RestaurantDashboard';
import HomeRestaurant from './pages/HomeRestaurant';
import GererMenu from './pages/GererMenu';
import QrcodeResto from './pages/qrcodeResto'; // Corrigé : nom du composant en PascalCase

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/scan" element={<PageScanner />} />
        <Route path="/scan/:idEtablissement" element={<PageClient />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin" element={<BackOffice />} />
        <Route path="/restodashboard" element={<RestaurantDashboard />} />
        <Route path="/homerestaurant" element={<HomeRestaurant />} />
        <Route path="/gerermenu" element={<GererMenu />} />
        <Route path="/qrcoderesto" element={<QrcodeResto />} /> {/* Corrigé : utilisation de QrcodeResto */}
      </Routes>
    </Router>
  );
}

export default App;