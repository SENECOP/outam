import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Pour récupérer l'ID du restaurant depuis l'URL
import { Link } from 'react-router-dom';

const MenuPage = () => {
    const { id } = useParams(); // Récupérer l'ID du restaurant depuis l'URL
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/restaurant/${id}/menu`); // Remplace par la route de ton API pour récupérer le menu
                const data = await response.json();
                
                if (response.ok) {
                    setMenuItems(data.menu); // On suppose que le backend renvoie les éléments du menu sous un tableau 'menu'
                } else {
                    setError('Erreur lors du chargement du menu.');
                }
            } catch (error) {
                setError('Une erreur s\'est produite.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [id]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Menu du restaurant</h2>
            
            <Link to={`/restaurants/${id}/add-menu-item`} className="mb-4 text-blue-500 hover:underline">
                Ajouter un nouvel élément au menu
            </Link>
            
            <div className="space-y-4">
                {menuItems.length === 0 ? (
                    <p>Aucun élément de menu trouvé. Ajoutez-en un !</p>
                ) : (
                    menuItems.map((item) => (
                        <div key={item._id} className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-md">
                            <img src={item.image} alt={item.title} className="w-20 h-20 rounded-lg" />
                            <div>
                                <h3 className="font-semibold text-xl">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="font-semibold">{item.price}€</p>
                                <p className="text-sm text-gray-500">Catégorie : {item.category}</p>
                                <div className="flex space-x-2 mt-2">
                                    <Link
                                        to={`/restaurants/${id}/menu/${item._id}/edit`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Modifier
                                    </Link>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleDeleteMenuItem(item._id)}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const handleDeleteMenuItem = async (itemId) => {
    try {
        const response = await fetch(`/api/menu/${itemId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            alert('Élément du menu supprimé avec succès');
            // Recharger les données du menu après la suppression
            window.location.reload(); 
        } else {
            alert('Erreur lors de la suppression de l\'élément du menu');
        }
    } catch (error) {
        alert('Une erreur s\'est produite lors de la suppression');
    }
};

export default MenuPage;
