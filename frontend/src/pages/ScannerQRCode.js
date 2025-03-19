import { useState } from "react";
import { QrReader } from "react-qr-reader";

const ScannerQRCode = ({ onScan }) => {
  const [scanResult, setScanResult] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      onScan(data); // Transmet le résultat au parent
    }
  };

  const handleError = (err) => {
    console.error("Erreur du scanner : ", err);
  };

  return (
    <div className="scanner-container">
      <h2>Scanner un QR Code</h2>
      <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={(result, error) => {
          if (result) handleScan(result.text);
          if (error) handleError(error);
        }}
        style={{ width: "100%" }}
      />
      {scanResult && <p>Résultat : {scanResult}</p>}
    </div>
  );
};

export default ScannerQRCode;
