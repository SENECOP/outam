import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from '../context/AppContext';
import { Download, Eye, EyeOff } from 'lucide-react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { FaWhatsapp, FaFacebook, FaEnvelope } from 'react-icons/fa';
import { BookOpen } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const QrcodeResto = () => {
  const { restaurantId } = useParams();
  const { currentRestaurant } = useAppContext();
  const [isMenuActive, setIsMenuActive] = useState(true);
  const qrCodeRef = useRef(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [isMenuDisabled, setIsMenuDisabled] = useState(false); // ou vrai selon votre condition

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const restaurantUrl = `https://www.qr-oulem.restaurantcheasilm.com/restaurant/${restaurantId}/menu`;

  const toggleMenuVisibility = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/restaurant/${restaurantId}/menu-status`, {
        isActive: !isMenuActive
      });
      setIsMenuActive(!isMenuActive);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text(`Menu - ${currentRestaurant.name}`, 105, 30, { align: 'center' });
    pdf.save(`qrcode-${currentRestaurant.name}.pdf`);
  };

  const downloadImage = () => {
    const svg = qrCodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `qrcode-${currentRestaurant.name}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleQRCodeClick = (e) => {
    if (!currentRestaurant) {
      e.preventDefault();
      alert("Aucun restaurant sélectionné");
      navigate('/restaurants'); // Redirige vers la page de sélection
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 ml-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4 shadow-md">
                <BookOpen size={24} className="text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Menu du restaurant</h1>
            </div>

            <nav className="bg-white shadow-sm rounded-lg mb-6 p-4">
              <div className="flex space-x-6 justify-start items-center">
                <button className="text-gray-600 hover:text-gray-800 px-3 py-2">
                  Menu actuel
                </button>
                <Link
                  to={`/gerermenu/${restaurantId}`}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Gerer menu
                </Link>
                <button className="text-gray-600 hover:text-gray-800 px-3 py-2">
                  Créer un menu
                </button>
                <Link
                  to={currentRestaurant ? `/restaurants/${currentRestaurant._id}/qrcode` : "#"}
                  onClick={handleQRCodeClick}
                  className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50"
                >
                  QR Code
                </Link>
                <button className="text-gray-600 hover:text-gray-800 px-3 py-2">
                  Historique
                </button>
              </div>
            </nav>

            <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
              <h1 className="text-xl font-bold mb-4">Créer une catégorie</h1>
              <p className="mb-4">Dans cet espace, vous pouvez créer votre QR Code et l'afficher dans votre restaurant ou le partager à vos clients.</p>

              <label className="block mb-2">Votre URL</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded-lg  mr-[500px]"
                value={restaurantUrl}
                readOnly
              />

<div className="flex items-center mb-4">
  <span className="mr-2">Statut de visibilité de votre Menu</span>
  <span className="text-sm text-gray-500 mr-2">{isMenuActive ? "Actif" : "Désactivé"}</span>
  <label className="relative inline-flex items-center cursor-pointer ml-4">
    <input
      type="checkbox"
      checked={isMenuActive}
      onChange={toggleMenuVisibility}
      className="sr-only peer"
      disabled={isMenuDisabled} // Désactive le switch si isMenuDisabled est vrai
    />
    <div className={`w-11 h-6 ${isMenuDisabled ? 'bg-gray-400' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
  </label>
  <span className="text-sm text-gray-500 ml-2">{isMenuActive ? "Désactivé" : "Actif"}</span>
</div>

              <div className="border p-4 rounded-lg bg-yellow-50 mr-[300px]">
  
  <div className="flex items-center justify-between">
    {/* QR Code à gauche */}
    <div className="mr-6 p-15"> {/* Augmenter la marge ici pour plus d'espace */}
      <QRCodeSVG ref={qrCodeRef} value={restaurantUrl} size={300} level="H" includeMargin={true} />
    </div>

    {/* Contenu à droite */}
    <div className="flex flex-col items-start mr-[400px]">
    <h2 className="font-medium mb-2">Partager votre QR Code</h2>
  <p className="text-sm mb-4">Vous pouvez télécharger ce </p> 
  <p className="text-sm mb-4">QR Code et l'afficher dans </p>  <p className="text-sm mb-4">votre restaurant.</p>

      {/* Boutons de téléchargement */}
      <div className="flex flex-col mb-4">
        <button onClick={downloadPDF} className="px-4 py-2 bg-green-500 text-white rounded-lg mb-2">Télécharger PDF</button>
        <button onClick={downloadImage} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Télécharger image</button>
      </div>

      <div className="flex space-x-4">
  <a href={`https://wa.me/?text=${encodeURIComponent(restaurantUrl)}`} target="_blank" rel="noopener noreferrer" className="text-green-500 text-4xl">
    <FaWhatsapp />
  </a>
  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(restaurantUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-4xl">
    <FaFacebook />
  </a>
  <a href={`mailto:?subject=Menu&body=${encodeURIComponent(restaurantUrl)}`} className="text-red-500 text-4xl">
    <FaEnvelope />
  </a>
</div>

    </div>
  </div>
</div>


            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default QrcodeResto;
