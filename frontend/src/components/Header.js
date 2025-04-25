import { Menu } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const apiUrl = process.env.REACT_APP_API_URL;

export default function Header({ toggleSidebar }) {
  const { currentRestaurant } = useAppContext();

  return (
    <header className="bg-white shadow p-4 ml-0 flex items-center relative z-20">
      <button 
        onClick={toggleSidebar} 
        className="text-gray-600 focus:outline-none z-20 md:hidden"
      >
        <Menu size={24} />
      </button>

      <h1 className="text-xl font-bold ml-4">{currentRestaurant?.name || "Restaurant"}</h1>

      <div className="ml-auto flex items-center space-x-4">
        <img
          src={`${apiUrl}/assets/logo.png`}
          alt="Logo"
          className="w-16 h-16 object-contain"
        />
      </div>
    </header>
  );
}
