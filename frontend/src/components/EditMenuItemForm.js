import React, { useState, useEffect } from 'react';

export default function EditMenuItemForm({ item, onClose }) {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({
        title: item?.title || '',
        price: item?.price?.toString() || '',
        description: item?.description || ''
    });
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(
        item?.image ? `${apiUrl}${item.image}` : null
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            
            // Créer une URL de prévisualisation locale
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        // Nettoyage de l'URL créée quand le composant est démonté
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Validation du prix
        const price = parseFloat(formData.price);
        if (isNaN(price)) {
            setError("Veuillez entrer un prix valide");
            setIsSubmitting(false);
            return;
        }

        try {
            const formPayload = new FormData();
            formPayload.append('title', formData.title);
            formPayload.append('price', price.toString());
            formPayload.append('description', formData.description);
            if (image) formPayload.append('image', image);

            const response = await fetch(
                `${apiUrl}/api/restaurant/${item.restaurantId}/menu/${item._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formPayload
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Échec de la mise à jour");
            }

            // Mettre à jour l'aperçu avec l'URL complète du serveur
            if (result.imagePath) {
                setImagePreview(`${apiUrl}${result.imagePath}`);
            }

            onClose(true); // Fermer et rafraîchir
        } catch (err) {
            console.error("Erreur:", err);
            setError(err.message || "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-2 p-4 bg-white rounded shadow-md max-w-lg">
            <form onSubmit={handleSubmit}>
                {/* Preview image */}
                {/* {(imagePreview || image) && (
                    <div className="flex justify-center mb-4">
                        <img
                            src={imagePreview}
                            alt="Prévisualisation"
                            className="w-32 h-32 object-cover rounded-lg"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150';
                                e.target.onerror = null;
                            }}
                        />
                    </div>
                )} */}

                {/* Form fields */}
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded text-sm"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border p-2 rounded text-sm"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded text-sm h-16"
                        required
                    />
                </div>

                {/* Image upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {imagePreview ? "Changer l'image" : "Ajouter une image"}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border p-2 rounded text-sm"
                    />
                </div>

                {/* Error display */}
                {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

                {/* Buttons */}
                <div className="flex flex-col space-y-2">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 text-black px-4 py-2 rounded text-sm hover:bg-gray-400 transition"
                        onClick={() => onClose(false)}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}
