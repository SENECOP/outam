import { useEffect, useState } from "react";

const BackOffice = () => {
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/qrcodes")
      .then((res) => res.json())
      .then((data) => setQrCodes(data))
      .catch((err) => console.error("Erreur de chargement :", err));
  }, []);

  return (
    <div>
      <h1>Gestion des QR Codes</h1>
      {qrCodes.length === 0 ? <p>Aucun QR Code trouvé</p> : 
        qrCodes.map(qr => (
          <div key={qr._id}>
            <p>ID : {qr.idEtablissement}</p>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${qr.urlUnique}`} alt="QR Code" />
            <a href={`https://api.qrserver.com/v1/create-qr-code/?data=${qr.urlUnique}`} download>📥 Télécharger</a>
          </div>
        ))
      }
    </div>
  );
};

export default BackOffice;
