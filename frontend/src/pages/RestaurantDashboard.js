import { useState } from "react";
import { Home, List, ShoppingCart, BarChart, User, LogOut, Menu ,BookOpen} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function SidebarLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const [menu, setMenu] = useState([
    { id: 1, name: "Mafé", price: 2500, description: "Un délicieux mafé à la viande, accompagné de légumes frais et une pâte d'arachide ...", image: "assets/m.jpeg", expanded: false },
    { id: 2, name: "Domoda", price: 5000, description: "Un délicieux mafé à la viande, accompagné de légumes frais et une pâte d'arachide ...", image: "assets/d.jpg", expanded: false },
    { id: 3, name: "Kaldou diola", price: 1500, description: "Un délicieux mafé à la viande, accompagné de légumes frais et une pâte d'arachide ...", image: "assets/y.jpeg", expanded: false },
    { id: 4, name: "Thiebou djeun", price: 3000, description: "Un délicieux mafé à la viande, accompagné de légumes frais et une pâte d'arachide ...", image: "assets/t.jpeg", expanded: false }
  ]);

  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", description: "", image: null });

  const menuItems = [
    { id: 1, name: "Mafé", price: 2500, description: "Un délicieux mafé à la viande, accompagné de légumes frais et une pâte d'arachide ...", image: "assets/m.jpeg", expanded: false },
    { id: 2, name: "Domoda", price: 5000, description: "Un délicieux mafé à la viande, accompagné de légumes frais et une pâte d'arachide ...", image: "assets/d.jpg", expanded: false },
    { id: 3, name: "Kaldou diola", price: 1500, description: "Un délicieux mafé à la viande, accompagné de légumes frais et une pâte d'arachide ...", image: "assets/y.jpeg", expanded: false },
    { id: 4, name: "Thiebou djeun", price: 3000, description: "Un délicieux mafé à la viande, accompagné de légumes frais et une pâte d'arachide ...", image: "assets/t.jpeg", expanded: false }
  ];

  const handleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen">
    <Sidebar isSidebarOpen={isSidebarOpen} />
    <div className="flex-1 flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <main className="p-4 bg-gray-100 min-h-screen">
      <h1 className="max-w-4xl ml-4 p-6 text-2xl font-bold mb-4 flex items-center">
  <div className="bg-blue-100 p-2 rounded-full mr-4 shadow-md"> {/* Fond vert, espace de 16px, ombre */}
    <BookOpen size={24} className="text-blue-500" /> {/* Icône de livre en vert */}
  </div>
  Menu du restaurant
</h1>
<div className="max-w-1xl mx-auto px- p-1 mr-[680px] ml-8">
      <nav className="flex justify-between border-b pb-0 mb-0">
        <div className="flex space-x-24">
        <button className="font-bold bg-white text-black px-3 py-2 rounded">Menu actuel</button>
          <button>Gérer le menu</button>
          <button>Créer un menu</button>
          <Link to="/qrcoderesto">
          <button>QR Code</button>
        </Link>
          <button>Historique</button>
        </div>
      </nav>

      <div className="bg-white p-0 ">
        {menuItems.map((item) => (
          <div key={item.id} className="border-b py-2 flex items-center">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded mr-4" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{item.name} ({item.price})</strong>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <button
                  className="bg-gray-200 px-2 py-1 rounded mr-8"
                  onClick={() => handleExpand(item.id)}
                >
                  {expanded === item.id ? "fermer" : "développer"}
                </button>
              </div>
              {expanded === item.id && (
                <div className="mt-2">
                  <input type="text" name="name" placeholder="Nom du plat" className="w-full border p-2 my-1" onChange={handleChange} />
                  <input type="text" name="price" placeholder="Prix du plat" className="w-full border p-2 my-1" onChange={handleChange} />
                  <textarea name="description" placeholder="Description du plat" className="w-full border p-2 my-1" onChange={handleChange} />
                  <input type="file" className="w-full border p-2 my-1" />
                  <button className="bg-green-600 text-white px-4 py-2 rounded">Enregistrer</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
      </main>
    </div>
  </div>
  );
}