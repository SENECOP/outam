import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterRestaurant = () => {
  const [name, setName] = useState("");
  const [commercantName, setCommercantName] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://outam.onrender.com/api/restaurant/registeresto", {
        name,
        commercantName,
        email,
        motDePasse
      });

      if (response.data.token) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundImage: "url('https://outam.onrender.com/assets/bg.png')",
        backgroundRepeat: "no-repeat", // Empêche la répétition de l'image
          backgroundSize: "cover"
       }}>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Créer un Restaurant</h2>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du restaurant"
          required
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          value={commercantName}
          onChange={(e) => setCommercantName(e.target.value)}
          placeholder="Nom du commerçant"
          required
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          placeholder="Mot de passe"
          required
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default RegisterRestaurant;
