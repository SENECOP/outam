import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

// Modal ajout publicité
function AddPubliciteModal({ onClose, onPubliciteAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    active: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/api/publicites`, form);
      onPubliciteAdded();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'ajout de la publicité."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-lg p-8 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-6 text-blue-700">Ajouter une publicité</h2>
        
        <label className="block mb-2 font-medium">Titre :</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />
        
        <label className="block mb-2 font-medium">Description :</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-4"
          rows={3}
          required
        />
        
        <label className="block mb-2 font-medium">URL de l'image :</label>
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />
        
        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="mr-2"
          />
          Active
        </label>
        
        {error && <div className="text-red-500 mb-3">{error}</div>}
        
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 font-semibold"
          >
            {loading ? "Ajout en cours..." : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Modal modification publicité
function EditPubliciteModal({ publicite, onClose, onSave }) {
  const [form, setForm] = useState({
    title: publicite.title || "",
    description: publicite.description || "",
    imageUrl: publicite.imageUrl || "",
    active: publicite.active || false,
  });
  const [updating, setUpdating] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(`${apiUrl}/api/publicites/${publicite._id}`, form);
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
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-8"
      >
        <h2 className="font-bold text-xl mb-4 text-blue-700">Modifier la publicité</h2>
        
        <label className="block mb-2 font-medium">Titre :</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />
        
        <label className="block mb-2 font-medium">Description :</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-4"
          rows={3}
          required
        />
        
        <label className="block mb-2 font-medium">URL de l'image :</label>
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />
        
        <label className="inline-flex items-center mb-4">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="mr-2"
          />
          Active
        </label>
        
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={updating}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 font-semibold"
          >
            {updating ? "Modification..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Carte publicité
function PubliciteCard({ publicite, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Voulez-vous vraiment supprimer cette publicité ?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${apiUrl}/api/publicites/${publicite._id}`);
      onDelete(publicite._id);
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
          <h3 className="font-semibold text-lg">{publicite.title}</h3>
          <span
            className={`text-xs px-3 py-1 rounded-full text-white ${
              publicite.active ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {publicite.active ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="mt-2 text-gray-600 mb-4">{publicite.description}</p>

        <img
          src={publicite.imageUrl}
          alt={publicite.title}
          className="w-full h-40 object-cover rounded mb-4"
          onError={(e) => (e.target.src = "/default-image.jpg")}
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(publicite)}
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
  );
}

// Liste principale des publicités
export default function PubliciteList() {
  const [publicites, setPublicites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPublicites();
    // eslint-disable-next-line
  }, []);

  function fetchPublicites() {
    setLoading(true);
    axios
      .get(`${apiUrl}/api/publicites`)
      .then((res) => {
        setPublicites(res.data);
      })
      .catch(() => {
        setPublicites([]);
      })
      .finally(() => setLoading(false));
  }

  function handleEdit(updated) {
    setPublicites((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
  }

  function handleDelete(id) {
    setPublicites((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-semibold text-2xl text-gray-700">Liste des publicités</h2>
        <div className="flex items-center space-x-4">
          <input
            className="bg-gray-100 rounded-full px-4 py-2 text-gray-500 focus:outline-none"
            placeholder="Recherche..."
          />
          <i className="far fa-bell text-xl text-gray-400 relative">
            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              9
            </span>
          </i>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            className="w-8 h-8 rounded-full border-2 border-gray-200"
            alt="User"
          />
          <span>Nowak</span>
          <i className="fas fa-cog text-gray-400" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="font-semibold text-lg">Publicités</h2>
        <button
          className="bg-blue-500 text-white px-5 py-2 rounded-full font-medium text-sm shadow hover:bg-blue-600 transition"
          onClick={() => setShowAddModal(true)}
        >
          + Ajouter une publicité
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {publicites.map((publicite) => (
            <PubliciteCard
              key={publicite._id}
              publicite={publicite}
              onEdit={setSelectedEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {selectedEdit && (
        <EditPubliciteModal
          publicite={selectedEdit}
          onClose={() => setSelectedEdit(null)}
          onSave={handleEdit}
        />
      )}

      {showAddModal && (
        <AddPubliciteModal
          onClose={() => setShowAddModal(false)}
          onPubliciteAdded={fetchPublicites}
        />
      )}
    </div>
  );
}
