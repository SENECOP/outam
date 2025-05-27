import React, { useState } from "react";
import { Cog6ToothIcon, MoonIcon, GlobeAltIcon, BellIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function Parametres() {
  const [theme, setTheme] = useState("light");
  const [langue, setLangue] = useState("fr");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-gray-800">⚙️ Paramètres du compte</h1>

        {/* Informations utilisateur */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-4 space-x-2">
            <Cog6ToothIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-700">Informations générales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">Nom complet</label>
              <input
                type="text"
                defaultValue="Jean Dupont"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Adresse e-mail</label>
              <input
                type="email"
                defaultValue="admin@exemple.com"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Préférences */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-4 space-x-2">
            <MoonIcon className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-700">Préférences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">Thème</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none"
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Langue</label>
              <select
                value={langue}
                onChange={(e) => setLangue(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none"
              >
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-4 space-x-2">
            <BellIcon className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-700">Notifications</h2>
          </div>
          <label className="flex items-center space-x-3 text-gray-600">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="h-5 w-5 text-yellow-500 rounded focus:ring-yellow-300"
            />
            <span>Recevoir les notifications par e-mail</span>
          </label>
        </section>

        {/* Sécurité */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-4 space-x-2">
            <KeyIcon className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-700">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Mot de passe actuel</label>
              <input
                type="password"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Nouveau mot de passe</label>
              <input
                type="password"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-300 outline-none"
              />
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow mt-3 transition-all">
              🔐 Mettre à jour le mot de passe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
