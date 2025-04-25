import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from '../context/AppContext';
import { Download, Eye, EyeOff } from 'lucide-react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { FaWhatsapp, FaFacebook, FaEnvelope } from 'react-icons/fa';

const QrcodeResto = () => {
  const { restaurantId } = useParams();
  const { currentRestaurant } = useAppContext();
  const [isMenuActive, setIsMenuActive] = useState(true);
  const qrCodeRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const restaurantUrl = `https://www.qr-oulem.restaurantcheasilm.com/restaurant/${restaurantId}/menu`;

  const toggleMenuVisibility = async () => {
    try {
      await axios.patch(
        `https://outam.onrender.com/api/restaurant/${restaurantId}/menu-status`,
        {
          isActive: !isMenuActive,
        }
      );
      setIsMenuActive(!isMenuActive);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngFile;
      downloadLink.download = `qrcode-${currentRestaurant.name}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src =
      'data:image/svg+xml;base64,' +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Créer une catégorie</h1>
      <p className="mb-4">
        Dans cet espace, vous pouvez créer votre QR Code et l'afficher dans
        votre restaurant ou le partager à vos clients.
      </p>

      <label className="block mb-2">Votre URL</label>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded-lg mb-4"
        value={restaurantUrl}
        readOnly
      />

      <div className="flex items-center mb-4">
        <span className="mr-2">Statut de visibilité de votre Menu</span>
        <button
          onClick={toggleMenuVisibility}
          className={`ml-4 px-4 py-2 rounded-lg ${isMenuActive ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
        >
          {isMenuActive ? (
            <Eye className="inline-block mr-1" />
          ) : (
            <EyeOff className="inline-block mr-1" />
          )}{' '}
          {isMenuActive ? 'Actif' : 'Désactivé'}
        </button>
      </div>

      <div className="border p-4 rounded-lg bg-gray-100">
        <h2 className="font-medium mb-2">Partager votre QR Code</h2>
        <p className="text-sm mb-4">
          Vous pouvez télécharger ce QR Code et l'afficher dans votre
          restaurant.
        </p>

        <div className="flex flex-col items-center">
          <div className="p-4 bg-white border rounded-lg mb-4">
            <QRCodeSVG
              ref={qrCodeRef}
              value={restaurantUrl}
              size={150}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="flex space-x-4 mb-4">
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Télécharger PDF
            </button>
            <button
              onClick={downloadImage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Télécharger image
            </button>
          </div>

          <div className="flex space-x-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(restaurantUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 text-2xl"
            >
              <FaWhatsapp />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(restaurantUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-2xl"
            >
              <FaFacebook />
            </a>
            <a
              href={`mailto:?subject=Menu&body=${encodeURIComponent(restaurantUrl)}`}
              className="text-red-500 text-2xl"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrcodeResto;
