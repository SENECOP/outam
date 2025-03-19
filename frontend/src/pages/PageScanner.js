import { useState } from "react";
import { QrReader } from "react-qr-reader";

const PageScanner = () => {
  const [scanResult, setScanResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      setTimeout(() => {
        window.location.href = data; // Redirige après scan
      }, 1500);
    }
  };

  const handleError = (err) => {
    console.error("Erreur du scanner : ", err);
  };

  return (
    <div className="scanner-page">
      <h1>Scanner un QR Code</h1>
      <div className="scanner-box">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (result) handleScan(result.text);
            if (error) handleError(error);
          }}
          style={{ width: "100%" }}
        />
      </div>
      {scanResult && (
        <p className="scan-result">
          ✅ QR Code détecté : <a href={scanResult}>{scanResult}</a>
        </p>
      )}
    </div>
  );
};

export default PageScanner;
