import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const ActiveMenus = () => {
  const { restaurantId } = useParams();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get(`https://outam.onrender.com/api/restaurant/${restaurantId}/menus/actives-une-fois`);
        setMenus(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des menus actifs', err);
        setErreur("Impossible de charger les menus actifs");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [restaurantId]);

  if (loading) return <div className="text-center text-gray-500">Chargement des menus...</div>;
  if (erreur) return <div className="text-center text-red-500">{erreur}</div>;

  return (
    <DashboardLayout>
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">

    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Menus Actifs</h2>

      {menus.length === 0 ? (
        <p className="text-center text-gray-500">Aucun menu actif pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menus.map((menu) => (
            <div key={menu._id} className="bg-white shadow-md rounded-xl p-4">
              <h3 className="text-xl font-semibold mb-2">{menu.name}</h3>
              <p className="text-sm text-gray-500 mb-3">Jour : {menu.day}</p>

              <ul className="space-y-2">
                {menu.dishes.map((dish, index) => (
                  <li key={index} className="border p-2 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">{dish.title}</span>
                      <span className="text-sm text-gray-700">{dish.price.toFixed(2)} €</span>
                    </div>
                    <p className="text-sm text-gray-600">{dish.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
    </DashboardLayout>
  );
};

export default ActiveMenus;
