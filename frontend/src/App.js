import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie'; // Import du CookiesProvider
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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
import DishDetail from './pages/DishDetail';
import DesktopDailyMenu from './pages/DailyMenu';
import ProfilRestaurant from './pages/Profile';
import ActiveMenus from './pages/ActiveMenus';

function App() {
  return (
    <BrowserRouter>
    <AppProvider>
    <CookiesProvider>  {/* Envelopper l'application dans CookiesProvider */}
    
        <Routes>
          <Route path="/" element={<LoginRestaurant />} />
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
          {/* <Route path="/loginrestaurant" element={<LoginRestaurant />} /> */}
          {/* <Route path="/registerestaurant" element={<RegisterRestaurant />} /> */}
          <Route path="/restaurant/:id" element={<RestaurantDashboard />} />
          <Route path="/restaurant/:restaurantId/menu/create" element={<MenuCreation />} />
          <Route path="/addcategorie/:id" element={<CategoryManager />} />
          <Route path="/registeresto" element={<RegisterRestaurant />} />
          <Route path="/menu/:restaurantId" element={<DesktopDailyMenu />} />
          <Route path="/restaurant/:id/dish/:dishId" element={<DishDetail />} />
          <Route path="/profil/:restaurantId" element={<ProfilRestaurant />} />
          <Route path="/restaurant/:restaurantId/menus-actifs" element={<ActiveMenus />} />

  
          </Routes>
        </CookiesProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
