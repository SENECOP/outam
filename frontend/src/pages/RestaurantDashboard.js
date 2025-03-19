import { useState } from "react";
import { Home, List, ShoppingCart, BarChart, User, LogOut, Menu ,BookOpen} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

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

  // États pour le formulaire
  const [newDish, setNewDish] = useState({ name: "", price: "", description: "", image: "" });

  // Gérer l'expansion des plats
  const toggleExpand = (id) => {
    setMenu(menu.map(dish => dish.id === id ? { ...dish, expanded: !dish.expanded } : dish));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDish.name && newDish.price) {
      setMenu([...menu, { id: menu.length + 1, ...newDish, expanded: false }]);
      setNewDish({ name: "", price: "", description: "", image: "" });
    }
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
      <div className="max-w-4xl ml-4 p-6 bg-white border border-black rounded-md">

      

      {/* Liste des plats */}
      <div className="space-y-4 ">
        {menu.map((dish) => (
          <div key={dish.id} className="p-4 bg-white border border-black rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded mr-4" />
              <div>
                <h2 className="text-lg font-semibold">{dish.name} ({dish.price} FCFA)</h2>
                {dish.expanded && <p className="text-sm text-gray-600">{dish.description}</p>}
              </div>
            </div>
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => toggleExpand(dish.id)}
            >
              {dish.expanded ? "fermer" : "développer"}
            </button>
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout de plat */}
      <div className="mt-6 p-4 bg-white ">
        <h2 className="text-lg font-semibold mb-2">Ajouter un plat</h2>
        <form onSubmit={handleSubmit} className="space-y-2 ">
          <input
            type="text"
            placeholder="Nom du plat"
            className="w-full p-2 bg-white "
            value={newDish.name}
            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Prix du plat"
            className="w-full p-2 border rounded"
            value={newDish.price}
            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
          />
          <textarea
            placeholder="Description du plat"
            className="w-full p-2 border rounded"
            value={newDish.description}
            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL de l'image"
            className="w-full p-2 border rounded"
            value={newDish.image}
            onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
          />
          <button type="submit" className="w-full p-2 bg-green-600 text-white rounded">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
      </main>
    </div>
  </div>
  );
}