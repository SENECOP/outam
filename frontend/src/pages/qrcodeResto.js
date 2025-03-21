import { useState, useEffect } from "react";
import axios from "axios";

const QrcodeResto = () => { // Corrigé : nom du composant en PascalCase
  const [qrCodes, setQrCodes] = useState([]);
  const [idEtablissement, setIdEtablissement] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/generate-qr");
      setQrCodes(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des QR Codes", error);
    }
  };

  const generateQRCode = async () => {
    if (!idEtablissement) return alert("Veuillez entrer un ID d'établissement");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/generate-qr", { idEtablissement });
      setQrCodes([...qrCodes, response.data]);
      setIdEtablissement("");
    } catch (error) {
      console.error("Erreur lors de la génération du QR Code", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Gestion des QR Codes</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="ID de l'établissement"
          value={idEtablissement}
          onChange={(e) => setIdEtablissement(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={generateQRCode}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Génération..." : "Générer un QR Code"}
        </button>
      </div>

      <div className="space-y-4">
        {qrCodes.map((qr, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <p><strong>Établissement ID:</strong> {qr.idEtablissement}</p>
            <p><strong>Lien:</strong> <a href={qr.url} className="text-blue-500">{qr.url}</a></p>
            <img src={qr.qrCodeImage} alt="QR Code" className="w-32 h-32 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QrcodeResto; // Corrigé : export du composant avec le bon nom