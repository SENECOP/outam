import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie'; // Import du CookiesProvider
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
import QrcodeResto from './pages/qrcodeResto'; // Nom du composant en PascalCase
import RestaurantPage from './pages/RestaurantPage';
import RestaurantDetails from './pages/RestaurantDetails';
import LoginR from './pages/LoginR';
import LoginRestaurant from './pages/LoginRestaurant';
import { AppProvider } from './context/AppContext';
import MenuCreation from './pages/MenuCreation';
import CategoryManager from './pages/CategoryManager';
import RegisterRestaurant from './pages/RegisterRestaurant';
import DailyMenu from './pages/DailyMenu';

function App() {
  return (
    <BrowserRouter>
    <AppProvider>
    <CookiesProvider>  {/* Envelopper l'application dans CookiesProvider */}
    
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/scan" element={<PageScanner />} />
          <Route path="/scan/:idEtablissement" element={<PageClient />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/registeresto" element={<Registerresto />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin" element={<BackOffice />} />
          <Route path="/restodashboard" element={<RestaurantDashboard />} />
          <Route path="/homer" element={<HomeRestaurant />} />
          <Route path="/gerermenu/:id" element={<GererMenu />} />
          <Route path="/restaurants/:restaurantId/qrcode" element={<QrcodeResto />} /> {/* Correction déjà faite ici */}
          <Route path="/restaurants" element={<RestaurantPage />} />
          <Route path="/loginr" element={<LoginR />} />
          <Route path="/loginrestaurant" element={<LoginRestaurant />} />
          {/* <Route path="/registerestaurant" element={<RegisterRestaurant />} /> */}
          <Route path="/restaurant/:id" element={<RestaurantDashboard />} />
          <Route path="/restaurant/:restaurantId/menu/create" element={<MenuCreation />} />
          <Route path="/addcategorie/:id" element={<CategoryManager />} />
          <Route path="/registeresto" element={<RegisterRestaurant />} />
          <Route path="/menu/:id" element={<DailyMenu />} />



  
          </Routes>
        </CookiesProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
