import React from "react";

const LandingPageRestaurant = () => {
  return (
    <div className="w-full bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4">
        <div className="flex flex-col items-center space-y-0">
          <img src="assets/logo.png" alt="Logo" className="w-24 h-24" /> {/* Logo agrandi */}
          {/* <span className="font-bold text-md">OUTAM</span> Texte sous le logo */}
        </div>
        <ul className="hidden md:flex space-x-6 text-lg font-bold text-black">
        <li><a href="#benefits" className="hover:text-blue-600">Benefits</a></li>
        <li><a href="#features" className="hover:text-blue-600">Functionalités</a></li>
        <li><a href="#howto" className="hover:text-blue-600">How-to</a></li>
        <li><a href="#contact" className="hover:text-blue-600">Contact Us</a></li>
        </ul>


       <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full text-lg font-semibold">
  S’inscrire
</button>

      </nav>

      {/* Hero Title */}
      <header className="text-center px-6 md:px-20 py-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-snug">
          Gestion simplifier de<br /> votre business.
        </h1>
      </header>

      {/* Image */}
      <div className="flex justify-center px-2 pb-16">
        <div className="w-full max-w-screen-xl">
          <img
            src='assets/Capture.PNG'
            alt="Interface de gestion"
            className="w-full rounded-xl"
          />
        </div>
      </div>

      
{/* Functionalities Section - Stylized Full Width */}
{/* Functionalities Section - Stylized with black SVG icons */}
<section className="w-full bg-gray-50 px-4 md:px-10 py-16">
  <h2 className="text-2xl md:text-4xl font-serif font-bold text-center mb-4">
    Tout les outils en un seul endroit.
  </h2>
  <p className="text-center text-gray-600 mb-12 text-sm md:text-base">
    Pas de téléchargement de software ni d’installation de hardware.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
    {/* Carte 1 */}
    <div className="bg-white rounded-2xl  p-6 hover:shadow-lg transition">
      <h3 className="flex items-center font-semibold text-lg mb-2">
        <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.83.48-5.76-.3-7.76-2.29s-2.77-4.93-2.29-7.76A8.994 8.994 0 0112 4v8l6.29 3.71c-.56 2.13-2.08 3.94-4.29 4.22z"/>
        </svg>
        Menu digital
      </h3>
      <p className="text-gray-600 text-sm">
        Rendez votre menu accessible digitalement par un simple scan du code QR.
      </p>
    </div>

    {/* Carte 2 */}
    <div className="bg-white rounded-2xl  p-6 hover:shadow-lg transition">
      <h3 className="flex items-center font-semibold text-lg mb-2">
        <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 6h18v2H3V6zm0 5h12v2H3v-2zm0 5h18v2H3v-2z"/>
        </svg>
        Gestion simplifier du menu
      </h3>
      <p className="text-gray-600 text-sm">
        Modifier, supprimer et mettre à jour votre menu par un simple click.
      </p>
    </div>

    {/* Carte 3 */}
    <div className="bg-white rounded-2xl  p-6 hover:shadow-lg transition">
      <h3 className="flex items-center font-semibold text-lg mb-2">
        <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3L19 4c0-1.66-1.34-3-3-3H8C6.34 1 5 2.34 5 4v4c0 1.66 1.34 3 3 3h8zM6 8V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2zm-2 7h16v2H4v-2zm0 4h10v2H4v-2z"/>
        </svg>
        Suivi de commande
      </h3>
      <p className="text-gray-600 text-sm">
        Suivez les commandes passer par vos clients et améliorer l’expérience utilisateur.
      </p>
    </div>

    {/* Carte 4 */}
    <div className="bg-white rounded-2xl  p-6 hover:shadow-lg transition">
      <h3 className="flex items-center font-semibold text-lg mb-2">
        <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 17h18v2H3v-2zm0-5h12v2H3v-2zm0-5h18v2H3V7z"/>
        </svg>
        Analyse de données et optimisation
      </h3>
      <p className="text-gray-600 text-sm">
        Des outils d’analyse et de performances pour améliorer vos services et votre chiffre d’affaires.
      </p>
    </div>

    {/* Carte 5 */}
    <div className="bg-white rounded-2xl  p-6 hover:shadow-lg transition">
      <h3 className="flex items-center font-semibold text-lg mb-2">
        <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        Bénéfice client
      </h3>
      <p className="text-gray-600 text-sm">
        Rendre la vie facile pour vos clients en digitalisant le menu et les tâches.
      </p>
    </div>

    {/* Carte 6 */}
    <div className="bg-white rounded-2xl  p-6 hover:shadow-lg transition">
      <h3 className="flex items-center font-semibold text-lg mb-2">
        <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4C7.03 4 2.73 7.11 1 11.5c1.73 4.39 6.03 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.11 16.97 4 12 4zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        </svg>
        Promotion
      </h3>
      <p className="text-gray-600 text-sm">
        Modifier, supprimer et mettre à jour votre menu par un simple click.
      </p>
    </div>
  </div>
</section>

 <div className="w-full bg-white py-16 px-4 md:px-16">
      {/* Fonctionnalités */}
      <section className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-24">
        {/* Texte */}
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Fonctionnalites</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Les fonctionnalités et services offerts par le software outam
          </p>
          <ul className="space-y-4 text-sm md:text-base">
            <li className="border-b pb-2">
              <span className="font-bold mr-3 text-black">01</span>
              Menu digital et payement sécurisé en ligne
            </li>
            <li className="border-b pb-2">
              <span className="font-bold mr-3 text-black">02</span>
              Gestion de commande
            </li>
            <li className="border-b pb-2">
              <span className="font-bold mr-3 text-black">03</span>
              Création et gestion de menu
            </li>
            <li className="border-b pb-2">
              <span className="font-bold mr-3 text-black">04</span>
              Analyse de données en temps réel
            </li>
          </ul>
        </div>

        {/* Image */}
        <div className="w-full">
          <img
            src="assets/F.jpg" // Remplace par ton chemin d'image correct
            alt="Interface utilisateur"
            className="rounded-xl w-full object-cover"
          />
        </div>
      </section>

      {/* Tarifs */}
      <section className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Plan gratuit */}
        <div className="bg-white rounded-xl border shadow-md p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Free Plan</h3>
            <p className="text-gray-500 text-sm mb-4">individual</p>
            <p className="text-3xl font-bold mb-1">0 FCFA <span className="text-base font-normal">/ month</span></p>

            <ul className="text-sm text-gray-700 space-y-2 mt-4">
              <li>✓ Un seul compte utilisateur</li>
              <li>✓ Gestion digital du menu</li>
              <li>✓ Suivi de performance</li>
              <li>✓ 100 % gratuit</li>
              <li>✓ Gestion de promotion gratuite</li>
            </ul>
          </div>
          <button className="mt-6 border border-black text-black px-4 py-2 rounded-full hover:bg-gray-100 transition">
            S’inscrire
          </button>
        </div>

        {/* Plan premium */}
        <div className="bg-white rounded-xl border shadow-md p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Premium plan</h3>
            <p className="text-gray-500 text-sm mb-4">compte multiple</p>
            <p className="text-3xl font-bold mb-1">50 000 FCFA <span className="text-base font-normal">/ month</span></p>

            <ul className="text-sm text-gray-700 space-y-2 mt-4">
              <li>✓ Plusieurs comptes utilisateur</li>
              <li>✓ Gestion digital du menu</li>
              <li>✓ Suivi de performance</li>
              <li>✓ 50 000 Fcfa toute l’année</li>
              <li>✓ Un QR code pour chaque utilisateur</li>
              <li>✓ Gestion de promotion gratuite</li>
              <li>✓ Rémunération des commissions publicitaires</li>
            </ul>
          </div>
          <button className="mt-6 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">
            S’inscrire
          </button>
        </div>
      </section>
    </div>
<br/>
<br/>
<hr/>
<br/>
<br/>
 <section className="w-full bg-gray-50 px-4 md:px-10 py-16">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12">How to</h2>
        <hr/>
        <br/>
        <br/>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4">
            <p className="text-5xl font-semibold text-gray-300">01</p>
            <h3 className="font-semibold text-lg">Commencer</h3>
            <p className="text-sm text-gray-600">
              Grâce à notre configuration intuitive, vous êtes opérationnel en quelques minutes.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-5xl font-semibold text-gray-300">02</p>
            <h3 className="font-semibold text-lg">Personnaliser et configurer</h3>
            <p className="text-sm text-gray-600">
              Personnaliser et configurer votre business de manière rapide et efficace.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-5xl font-semibold text-gray-300">03</p>
            <h3 className="font-semibold text-lg">Faites croître votre activité</h3>
            <p className="text-sm text-gray-600">
              Prenez des décisions éclairées pour dépasser vos objectifs.
            </p>
          </div>
        </div>
      </section>
<hr/>
<br/>
<br/>
      {/* Call to Action */}
      <section className="max-w-screen-md mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-serif font-bold">
          Commencer à utiliser dès maintenant
        </h2>
        <p className="text-sm text-gray-600">Pour un demo gratuit merci de vous inscrire</p>

        <form className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
          <input
            type="email"
            placeholder="Email address"
            className="border rounded-full px-5 py-3 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full transition"
          >
            S’inscrire
          </button>
        </form>
      </section>
      <br/>
<br/>
      <hr/>
<br/>
<br/>
    </div>
    
  );
};

export default LandingPageRestaurant;
