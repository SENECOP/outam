import React, { useState, useRef,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from '../context/AppContext';
import { Download, Eye, EyeOff } from 'lucide-react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { FaWhatsapp, FaFacebook, FaEnvelope } from 'react-icons/fa';
import { BookOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import DashboardLayout from '../components/DashboardLayout';


const QrcodeResto = () => {
  const [qrCodeEnabled, setQrCodeEnabled] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const { restaurantId } = useParams();
  const { currentRestaurant } = useAppContext();
  const qrOnlyRef = useRef(null);
  const [qrBase64Url, setQrBase64Url] = useState('');
  const [isMenuActive, setIsMenuActive] = useState(true);
  const qrCodeRef = useRef(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [isMenuDisabled, setIsMenuDisabled] = useState(false); // ou vrai selon votre condition
  const { id } = useParams();
 
  const handleQRCodeClick = (e) => {
    if (!currentRestaurant) {
      e.preventDefault();
      alert('Aucun restaurant sélectionné');
      navigate('/restaurants');
    }
  };
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction
    ? `https://outam.netlify.app/menu/${restaurantId}`  // URL de production
    : `http://localhost:3000/menu/${restaurantId}`;   // URL locale
  
  const restaurantUrl = baseUrl;
  
  const toggleMenuVisibility = async () => {
    try {
      await axios.patch(
        `${apiUrl}/api/restaurant/${restaurantId}/menu-status`,
        {
          isActive: !isMenuActive,
        }
      );
      setIsMenuActive(!isMenuActive);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const downloadPDF = async () => {
    if (!qrOnlyRef.current) return;
  
    const element = qrOnlyRef.current;
  
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#ffffff'
    });
  
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
  
    // Taille personnalisée du QR Code dans le PDF
    const qrWidth = 100; // en mm (ajuste ici, ex: 80, 100, 120...)
    const qrHeight = (canvas.height * qrWidth) / canvas.width;
  
    const pageWidth = pdf.internal.pageSize.getWidth();
    const x = (pageWidth - qrWidth) / 2; // centrer horizontalement
    const y = 40; // position verticale
  
    pdf.addImage(imgData, 'PNG', x, y, qrWidth, qrHeight);
    pdf.save(`qrcode-${currentRestaurant.name}.pdf`);
  };
  
  

  const downloadImage = async () => {
    if (!qrOnlyRef.current) return;
  
    const canvas = await html2canvas(qrOnlyRef.current, {
      useCORS: true,
      backgroundColor: '#ffffff',
      scale: 2,
    });
  
    const image = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = image;
    downloadLink.download = `qrcode-${currentRestaurant.name}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  const uploadQRCodeToCloudinary = async () => {
    const svg = qrCodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
  
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
  
      const pngDataUrl = canvas.toDataURL('image/png');
  
      // Prépare FormData pour Cloudinary
      const formData = new FormData();
      formData.append('file', pngDataUrl);
      formData.append('upload_preset', 'qr_upload'); // ⚠️ à remplacer
      formData.append('cloud_name', 'dtu2zb4fu'); // ⚠️ à remplacer
  
      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dtu2zb4fu/image/upload', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        if (data.secure_url) {
          setQrBase64Url(data.secure_url); // ✅ URL publique de Cloudinary
        }
      } catch (error) {
        console.error('Erreur d’upload vers Cloudinary', error);
      }
    };
  
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

useEffect(() => {
  if (qrCodeRef.current && qrCodeEnabled && isMenuActive) {
    uploadQRCodeToCloudinary();
  }
}, [qrCodeEnabled, isMenuActive]);



  useEffect(() => {
    const fetchQrStatus = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/restaurant/restaurant${restaurantId}`);
        setQrCodeEnabled(res.data.qrCodeEnabled);
      } catch (error) {
        console.error("Erreur lors de la récupération du statut du QR code :", error);
      }
    };
  
    fetchQrStatus();
  }, [restaurantId]);
  
  const toggleQRCodeVisibility = async () => {
    try {
      const updatedValue = !qrCodeEnabled;
      await axios.patch(`${apiUrl}/api/restaurant/${restaurantId}/qrcode-visibility`, {
        enable: updatedValue,
      });
      setQrCodeEnabled(updatedValue);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la visibilité du QR Code :", error);
    }
  };
  const hasUploadedRef = useRef(false);

  useEffect(() => {
    const uploadImageToCloudinary = async () => {
      if (!qrOnlyRef.current || hasUploadedRef.current) return;
  
      const canvas = await html2canvas(qrOnlyRef.current, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2,
      });
  
      const pngDataUrl = canvas.toDataURL('image/png');
  
      const formData = new FormData();
      formData.append('file', pngDataUrl);
      formData.append('upload_preset', 'qr_upload'); // ⚠️ Ton preset Cloudinary
      formData.append('cloud_name', 'dtu2zb4fu'); // ⚠️ Ton cloud name
  
      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dtu2zb4fu/image/upload', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        if (data.secure_url) {
          setQrBase64Url(data.secure_url); // ← L’image hébergée à partager
          hasUploadedRef.current = true;
        }
      } catch (error) {
        console.error('Erreur d’upload vers Cloudinary', error);
      }
    };
  
    if (qrCodeEnabled && isMenuActive) {
      uploadImageToCloudinary();
    }
  }, [qrCodeEnabled, isMenuActive, restaurantUrl]);
  
  return (
    <DashboardLayout>
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar isSidebarOpen={isSidebarOpen} /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header toggleSidebar={toggleSidebar} /> */}
        <main className="flex-1 overflow-y-auto p-4 ml-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4 shadow-md">
                <BookOpen size={24} className="text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Menu du restaurant
              </h1>
            </div>

            <nav className="bg-white shadow-sm rounded-lg mb-6 p-4">
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
              <Link 
            to={`/restaurant/${restaurantId}`}
            className="text-gray-600 hover:text-gray-800 px-3 py-2"
          >
            Menu actuel
          </Link>
                <Link
                  to={`/gerermenu/${restaurantId}`}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Gerer menu
                </Link>
                <Link
            to={`/restaurant/${currentRestaurant._id}/menu/create`}
            onClick={handleQRCodeClick}
            className="text-gray-600 hover:text-gray-800 px-3 py-2"
          >
            Créer un menu
          </Link>
          <Link
                  to={`/addcategorie/${restaurantId}`}
                  onClick={handleQRCodeClick}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Creer une categorie
                </Link>
                <Link
                  to={
                    currentRestaurant
                      ? `/restaurants/${currentRestaurant._id}/qrcode`
                      : '#'
                  }
                  onClick={handleQRCodeClick}
                  className="font-medium text-blue-600 px-3 py-2 rounded-lg bg-blue-50"
                >
                  QR Code
                </Link>
                <Link to={`/restaurant/${restaurantId}/menus-actifs`} className="text-gray-600 hover:text-gray-800 px-3 py-2">
  Historique
</Link>
              </div>
            </nav>

            <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
  <h1 className="text-xl font-bold mb-4">QRcode du restaurant</h1>
  <p className="mb-4">
    Dans cet espace, vous pouvez créer votre QR Code et l'afficher
    dans votre restaurant ou le partager à vos clients.
  </p>

  <label className="block mb-2">Votre URL</label>
  <input
    type="text"
    className="w-full border px-3 py-2 rounded-lg"
    value={restaurantUrl}
    readOnly
  />

<div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0">
  <span className="mr-2">Visibilité du QR Code</span>
  <span className="text-sm text-gray-500 mr-2">
    {qrCodeEnabled ? 'Visible' : 'Masqué'}
  </span>
  <label className="relative inline-flex items-center cursor-pointer sm:ml-4">
    <input
      type="checkbox"
      checked={qrCodeEnabled}
      onChange={toggleQRCodeVisibility}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
  </label>
  <span className="text-sm text-gray-500 sm:ml-2">
    {qrCodeEnabled ? 'Masquer' : 'Afficher'}
  </span>
</div>


  <div
    ref={qrCodeRef}
    className="border p-4 rounded-lg bg-yellow-50 lg:mr-[300px]"
  >
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
      {/* QR Code - centré sur mobile, à gauche sur desktop */}
      <div className="p-4 lg:mr-6" ref={qrOnlyRef}>
      {isMenuActive && qrCodeEnabled ? (
  <QRCodeSVG
    value={restaurantUrl}
    size={window.innerWidth < 1024 ? 200 : 300}
    level="H"
    includeMargin={true}
  />
) : (
  <div className="text-gray-500 text-center">
    {qrCodeEnabled ? "Le menu est désactivé." : "Le QR Code est masqué."}
  </div>
)}

</div>


      {/* Contenu - empilé sur mobile, à droite sur desktop */}
      <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
        <h2 className="font-medium mb-2 text-center lg:text-left">Partager votre QR Code</h2>
        <p className="text-sm mb-4 text-center lg:text-left">
          Vous pouvez télécharger ce QR Code et l'afficher dans votre restaurant.
        </p>
        
        {/* Boutons de téléchargement */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mb-4 w-full">
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-green-500 text-white rounded-lg w-full sm:w-auto lg:w-full"
          >
            Télécharger PDF
          </button>
          <button
            onClick={downloadImage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full sm:w-auto lg:w-full"
          >
            Télécharger image
          </button>
        </div>
        
        {/* Icônes de partage */}
        {qrBase64Url && (
  <div className="flex justify-center lg:justify-start gap-4 w-full">
    <a
      href={`https://wa.me/?text=${encodeURIComponent(`Scannez ce QR Code pour accéder à notre menu : ${qrBase64Url}`)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-500 text-4xl"
    >
      <FaWhatsapp />
    </a>
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(qrBase64Url)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 text-4xl"
    >
      <FaFacebook />
    </a>
    <a
      href={`mailto:?subject=QR Code de notre menu&body=Voici le QR Code de notre menu : ${qrBase64Url}`}
      className="text-red-500 text-4xl"
    >
      <FaEnvelope />
    </a>
  </div>
)}

      </div>
    </div>
  </div>
</div>
          </div>
        </main>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default QrcodeResto;