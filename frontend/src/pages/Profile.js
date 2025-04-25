import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { FaUser } from "react-icons/fa";

const ProfilRestaurant = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [commercantName, setCommercantName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/restaurant/${restaurantId}`);
        setRestaurant(data);
        setName(data.name || '');
        setImagePreview(data.logo || null);
        setEmail(data.commercantInfo?.email || '');
        setCommercantName(data.commercantInfo?.name || '');
        setTelephone(data.commercantInfo?.telephone || '');
        setMotDePasse(''); // Ne pas préremplir le mot de passe
      } catch (err) {
        console.error('Erreur lors du chargement du restaurant', err);
        setError('Erreur lors du chargement du restaurant.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('commercantInfo.name', commercantName);
      formData.append('commercantInfo.email', email);
      formData.append('commercantInfo.telephone', telephone);
      if (motDePasse) {
        formData.append('commercantInfo.motDePasse', motDePasse);
      }
      if (image) {
        formData.append('logo', image);
      }

      // 👀 Debug : voir les données envoyées
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const { data } = await axios.put(
        `${apiUrl}/api/restaurant/${restaurantId}`,
        formData
      );

      setRestaurant(data);
      setSuccess("✅ Informations mises à jour avec succès !");
      setError(null);
    } catch (err) {
      console.error("❌ Erreur lors de la mise à jour :", err);
      const errorMessage = err.response?.data?.message || err.message || "Erreur inconnue.";
      setError(errorMessage);
      setSuccess(null);
    }
  };

  if (loading) return <p className="p-4">Chargement...</p>;

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 ml-1">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4 shadow-md">
                  <FaUser size={24} className="text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Compte et profils
                </h1>
              </div>

              <nav className="bg-white shadow-sm rounded-lg mb-6 p-4">
                <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
                  <button className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50">
                    Modifier le profil
                  </button>
                </div>
              </nav>

              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl ml-2 mt-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Information générale</h2>
                  <p className="text-sm text-gray-500 mb-4">Dans cet espace, vous pouvez modifier les informations de votre restaurant.</p>

                  {error && <p className="text-red-500 mb-4">{error}</p>}
                  {success && <p className="text-green-500 mb-4">{success}</p>}

                  <div className="mb-4">
                    <label className="block mb-1">Nom du restaurant</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Restaurant Salim"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1">Nom du commerçant</label>
                    <input
                      type="text"
                      value={commercantName}
                      onChange={(e) => setCommercantName(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Nom du responsable"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1">Logo</label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="w-full border rounded px-3 py-2"
                    />
                    {imagePreview && <img src={imagePreview} alt="Logo Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1">Adresse email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block mb-1">Mot de passe (laisser vide si inchangé)</label>
                    <input
                      type="password"
                      value={motDePasse}
                      onChange={(e) => setMotDePasse(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilRestaurant;
