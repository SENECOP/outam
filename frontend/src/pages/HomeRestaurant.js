import { useState } from 'react';
import { LayoutDashboard, ShoppingCart, BarChart, User } from 'lucide-react';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext'; // Import du contexte
import { useNavigate } from 'react-router-dom';

export default function HomeRestauran() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(''); // Ajout de l'état pour l'erreur
  const { user } = useAppContext(); // Récupérer l'utilisateur depuis le contexte
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = (title) => {
    if (!user?.restaurantId) {
      const errMsg = 'ID du restaurant non disponible';
      setError(errMsg);
      console.error(errMsg);
      return;
    }
  
    console.log('Restaurant ID: ', user.restaurantId);
  
    if (title === 'Menu du restaurant') {
      try {
        navigate(`/restaurant/${user.restaurantId}`);
      } catch (err) {
        const errorMsg = 'Erreur de redirection vers le menu';
        setError(errorMsg);
        console.error(errorMsg, err);
      }
    }
  
    if (title === 'Compte et profils') {
      try {
        navigate(`/profil/${user.restaurantId}`);
      } catch (err) {
        const errorMsg = 'Erreur de redirection vers le profil';
        setError(errorMsg);
        console.error(errorMsg, err);
      }
    }
  };
  

  const menuItems = [
    {
      title: 'Menu du restaurant',
      description: 'Modifiez, mettez à jour et gérez votre menu.',
      icon: <LayoutDashboard className="w-6 h-6 text-blue-600" />,
    },
    // {
    //   title: 'Commandes clients',
    //   description: 'Suivez et gérez les commandes de vos clients.',
    //   icon: <ShoppingCart className="w-6 h-6 text-red-500" />,
    // },
    {
      title: 'Analyse des données',
      description: 'Consultez les statistiques et performances.',
      icon: <BarChart className="w-6 h-6 text-green-500" />,
    },
    {
      title: 'Compte et profils',
      description: 'Gérez vos informations personnelles.',
      icon: <User className="w-6 h-6 text-orange-500" />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-900 flex">
      <div className="w-full bg-gray-100 rounded-lg shadow-lg">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Contenu principal */}
        <div className="p-6 mx-auto max-w-3xl lg:max-w-4xl xl:max-w-6xl">
        <div className="flex items-center gap-4 mb-4">
        <img
  src={
    user?.commercantInfo?.photoDeProfil?.startsWith("http")
      ? user.commercantInfo.photoDeProfil
      : `${apiUrl}/assets/${user.commercantInfo?.photoDeProfil || "default-avatar.jpg"}`
  }
  alt="Profil"
  className="w-12 h-12 rounded-lg object-cover"
/>



  <h2 className="text-2xl font-bold">
    Bonjour {user?.name || 'Utilisateur'} !
  </h2>
</div>


  {error && (
    <div className="text-red-500 text-lg mb-4">
      <strong>Erreur: </strong>
      {error}
    </div>
  )}

  <div className="space-y-4">
    {menuItems.map((item, index) => (
      <div
        key={index}
        className="flex items-center space-x-4 p-6 md:p-8 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => handleMenuItemClick(item.title)}
      >
        {item.icon}
        <div>
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
}
