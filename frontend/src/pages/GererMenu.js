import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function GererMenu() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [menus, setMenus] = useState([
    {
      id: 1,
      name: "Menu Lundi",
      date: "12/03/2025 12h35",
      expanded: false,
      status: "Activé",
      categories: [
        {
          name: "Rapas du matin",
          dishes: [
            { name: "Vasas Guinar", price: 1500 },
            { name: "Soupe Kandia", price: 2000 },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Menu Samedi",
      date: "12/03/2025 12h35",
      expanded: false,
      status: "Désactivé",
      categories: [
        {
          name: "Rapas du matin",
          dishes: [
            { name: "Vasas Guinar", price: 1500 },
            { name: "Soupe Kandia", price: 2000 },
          ],
        },
      ],
    }, // <-- Virgule ajoutée ici
    {
      id: 3,
      name: "Menu Dimanche",
      date: "12/03/2025 12h35",
      expanded: false,
      status: "Désactivé",
      categories: [
        {
          name: "Repas du soir",
          dishes: [
            { name: "Lakh", price: 1500 },
            { name: "Mbaxal Saloum", price: 2000 },
          ],
        },
      ],
    },
  ]);

  const toggleExpand = (id) => {
    setMenus(
      menus.map((menu) =>
        menu.id === id ? { ...menu, expanded: !menu.expanded } : menu
      )
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-4 bg-gray-100 min-h-screen">
          <h1 className="max-w-4xl ml-4 p-6 text-2xl font-bold mb-4 flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-4 shadow-md">
              <BookOpen size={24} className="text-blue-500" />
            </div>
            Menu du restaurant
          </h1>

          <div className="max-w-4xl ml-4 p-6 bg-white border border-black rounded-md">
            {/* Section: Gérer votre menu */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Gérer votre menu</h2>
              <p className="text-gray-600">
                Dans cet espace, vous pouvez gérer vos différents menus.
              </p>
            </section>

            {/* Liste des menus */}
            <section>
              {menus.map((menu) => (
                <div key={menu.id} className="mb-4">
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
                    <div>
                      <h3 className="font-semibold">{menu.name}</h3>
                      <p className="text-sm text-gray-600">
                        Date de création : {menu.date}
                      </p>
                    </div>
                    <button
                      className="p-2 bg-gray-200 rounded"
                      onClick={() => toggleExpand(menu.id)}
                    >
                      {menu.expanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>

                  {menu.expanded && (
                    <div className="mt-2 p-4 bg-white border border-gray-200 rounded-md">
                      <div className="mb-4">
                        <h4 className="font-semibold">Statut du menu</h4>
                        <p className="text-sm text-gray-600">{menu.status}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold">Catégories du menu</h4>
                        {menu.categories.map((category, index) => (
                          <div key={index} className="mt-2">
                            <h5 className="text-sm font-semibold">
                              {category.name}
                            </h5>
                            <ul className="ml-4">
                              {category.dishes.map((dish, dishIndex) => (
                                <li key={dishIndex} className="text-sm text-gray-600">
                                  {dish.name} - {dish.price} FCFA
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}