import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { BookOpen} from "lucide-react";



export default function QRCodePage() {
  const [id, setId] = useState("");
  const qrRef = useRef(null); // Référence pour télécharger le QR Code
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    generateQRCode(); // Génère un QR Code au chargement
  }, []);

  // Fonction pour générer un nouvel ID et QR Code
  const generateQRCode = () => {
    setId(uuidv4());
  };

  // Fonction pour télécharger le QR Code
  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `QRCode-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  
  return (
    <div className="flex h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <Header toggleSidebar={toggleSidebar} />
          <main className="p-4 bg-gray-100 min-h-screen">
          <h1 className="max-w-4xl ml-4 p-6 text-2xl font-bold mb-4 flex items-center">
      <div className="bg-blue-100 p-2 rounded-full mr-4 shadow-md"> {/* Fond vert, espace de 16px, ombre */}
        <BookOpen size={24} className="text-blue-500" /> {/* Icône de livre en vert */}
      </div>
      Menu du restaurant
    </h1>
    <div className="max-w-1xl mx-auto px- p-1 mr-[680px] ml-8">
    <nav className="flex justify-between border-b pb-0 mb-2">

            <div className="flex space-x-24">
            <button >Menu actuel</button>
              <button>Gérer le menu</button>
              <button>Créer un menu</button>
              <Link to="/qrcoderesto">
              <button className="font-bold bg-white text-black px-3 py-2 rounded">QR Code</button>
            </Link>
              <button>Historique</button>
            </div>
          </nav>
    
          <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="max-w-4xl ml-4 p-4 text-2xl font-bold mb-2 mt-0 flex items-center">
          Restaurant chez Salim</h1>

      <div ref={qrRef} className="p-0 bg-white shadow-lg rounded">
        {id && <QRCodeCanvas value={`https://mon-site.com/menu/${id}`} size={400} />}
      </div>

      <div className="mt-4 space-x-4">
        {/* <button
          onClick={generateQRCode}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          Régénérer QR Code
        </button> */}

        <button
          onClick={downloadQRCode}
          className="bg-green-500 text-white px-0 py-2 rounded shadow"
        >
          Télécharger QR Code
        </button>
      </div>
    </div>

        </div>
          </main>
        </div>
      </div>
  );
}
