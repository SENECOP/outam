import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
function AddRestaurantModal({ onClose, onRestaurantAdded }) {
  const [form, setForm] = useState({
    name: "",
    commercantName: "",
    email: "",
    motDePasse: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/api/restaurant/registeresto`, form);
      onRestaurantAdded();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de l'ajout du restaurant."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <form
        className="bg-white w-full max-w-md rounded-lg p-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-6 text-blue-700">Ajouter un restaurant</h2>
        <label className="block mb-2 font-medium">Nom du restaurant :</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-medium">Nom du commerçant :</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          name="commercantName"
          value={form.commercantName}
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-medium">Email du commerçant :</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-medium">Mot de passe :</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          name="motDePasse"
          type="password"
          value={form.motDePasse}
          onChange={handleChange}
          required
        />
        {error && (
          <div className="text-red-500 mb-3">{error}</div>
        )}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-medium"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 font-semibold"
            disabled={loading}
          >
            {loading ? "Ajout en cours..." : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
// Modal design for edition
function EditModal({ restaurant, onClose, onSave }) {
  const [form, setForm] = useState({
    name: restaurant.name || "",
    email: restaurant.commercantInfo?.email || "",
    commercantName: restaurant.commercantInfo?.name || "",
    logo: "",
  });
  const [updating, setUpdating] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setForm((f) => ({ ...f, logo: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setUpdating(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("commercantInfo.name", form.commercantName);
    data.append("commercantInfo.email", form.email);
    if (form.logo) data.append("logo", form.logo);

    try {
      const res = await axios.put(
        `${apiUrl}/api/restaurant/restaurants/${restaurant._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onSave(res.data);
      onClose();
    } catch (err) {
      alert("Erreur lors de la modification.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-8"
        onSubmit={handleSubmit}
      >
        <h2 className="font-bold text-xl mb-4 text-blue-700">Modifier le restaurant</h2>
        <label className="block mb-2 font-medium">Nom :</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-medium">Nom du commerçant :</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          name="commercantName"
          value={form.commercantName}
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-medium">Email commerçant :</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-medium">Logo :</label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          className="mb-4"
          onChange={handleChange}
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-medium"
            disabled={updating}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 font-semibold"
            disabled={updating}
          >
            {updating ? "Modification..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

function RestaurantCard({ restaurant, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Voulez-vous vraiment supprimer ce restaurant ?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${apiUrl}/api/restaurant/restaurants/${restaurant._id}`);
      onDelete(restaurant._id);
    } catch (err) {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-w-[340px] relative group transition-all">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
          <span className={`text-xs px-3 py-1 rounded-full text-white ${restaurant.isMenuActive ? "bg-green-500" : "bg-gray-400"}`}>
            {restaurant.isMenuActive ? "Menu actif" : "Inactif"}
          </span>
        </div>
        <div className="mt-1 mb-2">
          <span className="text-xs font-semibold uppercase text-gray-400">ID: {restaurant._id}</span>
        </div>
        <div className="text-gray-400 text-sm mb-4">
          {restaurant.commercantInfo?.email && (
            <>
              <span className="font-bold text-gray-700">Email commerçant&nbsp;:</span> {restaurant.commercantInfo.email}
            </>
          )}
        </div>
        <div className="mb-2 font-semibold">Logo :</div>
        <div className="flex mb-4">
          <img
            src={
              restaurant.logo && restaurant.logo !== "default-logo.jpg"
                ? restaurant.logo
                : "/default-logo.jpg"
            }
            alt="logo"
            className="w-12 h-12 rounded-full border-2 border-white"
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Menus</span>
          <span className="text-right">{restaurant.menus?.length || 0}</span>
        </div>
        <div className="w-full h-1 rounded bg-gray-100 mt-2">
          <div
            className="h-1 rounded bg-blue-400"
            style={{
              width: restaurant.menus?.length
                ? Math.min(restaurant.menus.length * 20, 100) + "%"
                : "0%"
            }}
          ></div>
        </div>
        <div className="flex justify-end space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(restaurant)}
            className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-xs shadow"
            title="Modifier"
          >
            <i className="fas fa-edit mr-1"></i> Modifier
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-semibold text-xs shadow"
            title="Supprimer"
          >
            <i className="fas fa-trash mr-1"></i> {deleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEdit, setSelectedEdit] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
  
 useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line
  }, []);

  function fetchRestaurants() {
    setLoading(true);
    axios
      .get(`${apiUrl}/api/restaurant/restaurants`)
      .then((res) => {
        setRestaurants(res.data);
      })
      .catch(() => {
        setRestaurants([]);
      })
      .finally(() => setLoading(false));
  }
  function handleEdit(updated) {
    setRestaurants((prev) =>
      prev.map((r) => (r._id === updated._id ? updated : r))
    );
  }

  function handleDelete(id) {
    setRestaurants((prev) => prev.filter((r) => r._id !== id));
  }

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-6">
       <div className="flex justify-between items-center mb-8">
        <h2 className="font-semibold text-2xl text-gray-700">Liste des restaurants</h2>
        <div className="flex items-center space-x-4">
          <input className="bg-gray-100 rounded-full px-4 py-2 text-gray-500 focus:outline-none" placeholder="Recherche..." />
          <i className="far fa-bell text-xl text-gray-400 relative">
            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full px-1">9</span>
          </i>
          <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-8 h-8 rounded-full border-2 border-gray-200" alt="User" />
          <span>Nowak</span>
          <i className="fas fa-cog text-gray-400" />
        </div>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-semibold text-lg">Restaurants</h2>
         <button
          className="bg-blue-500 text-white px-5 py-2 rounded-full font-medium text-sm shadow hover:bg-blue-600 transition"
          onClick={() => setShowAddModal(true)}
        >
          + Ajouter un restaurant
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
              onEdit={setSelectedEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      {selectedEdit && (
        <EditModal
          restaurant={selectedEdit}
          onClose={() => setSelectedEdit(null)}
          onSave={handleEdit}
        />
      )}
      {showAddModal && (
        <AddRestaurantModal
          onClose={() => setShowAddModal(false)}
          onRestaurantAdded={fetchRestaurants}
        />
      )}
    </div>
  );
}