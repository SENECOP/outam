import { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        'https://outam.onrender.com/api/commercant/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      setMessage(
        'Email envoyé avec succès ! Vérifiez votre boîte de réception.'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Conteneur du formulaire */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-96 md:w-[450px] z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/assets/logo.png" alt="Logo" className="h-20" />
        </div>

        <h2 className="text-center text-xl font-semibold text-gray-800">
          Mot de passe oublié ?
        </h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Pas de panique, nous allons vous aider à renouveler votre mot de
          passe.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full mt-4 px-4 py-2 border rounded-md focus:ring focus:ring-yellow-500 focus:outline-none"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'RÉINITIALISER MOT DE PASSE'}
          </button>
        </form>

        {/* Affichage du message */}
        {message && (
          <p className="text-center text-green-600 mt-4">{message}</p>
        )}
        {error && <p className="text-center text-red-600 mt-4">{error}</p>}

        {/* Service Client */}
        <p className="mt-4 text-center text-sm text-red-600 flex items-center justify-center">
          <span className="mr-1">⚠️</span>
          Service Client : <span className="underline">33 843 22 33</span>
        </p>

        {/* Bouton Retour */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 text-yellow-600 hover:underline"
        >
          &larr; Retour
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
