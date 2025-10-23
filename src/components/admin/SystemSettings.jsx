import React, { useState } from 'react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'C.A.S.T. Chorale',
    siteDescription: 'Chorale Associative de Tradition',
    contactEmail: 'contact@cast-chorale.com',
    maintenanceMode: false,
    allowRegistrations: true,
    maxFileSize: 10
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert('Paramètres sauvegardés avec succès!');
  };

  const handleResetSettings = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setSettings({
        siteName: 'C.A.S.T. Chorale',
        siteDescription: 'Chorale Associative de Tradition',
        contactEmail: 'contact@cast-chorale.com',
        maintenanceMode: false,
        allowRegistrations: true,
        maxFileSize: 10
      });
      alert('Paramètres réinitialisés!');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres du Système</h2>
      
      <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-6">
        {/* Informations générales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Informations Générales</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de contact
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Paramètres de sécurité */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Paramètres de Sécurité</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode maintenance
                </label>
                <p className="text-sm text-gray-500">
                  Le site sera inaccessible aux visiteurs
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                className="h-5 w-5 text-green-600 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inscriptions autorisées
                </label>
                <p className="text-sm text-gray-500">
                  Permettre aux nouveaux utilisateurs de s'inscrire
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowRegistrations}
                onChange={(e) => setSettings(prev => ({ ...prev, allowRegistrations: e.target.checked }))}
                className="h-5 w-5 text-green-600 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taille maximale des fichiers (MB)
              </label>
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                min="1"
                max="100"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            Sauvegarder les paramètres
          </button>
          <button
            type="button"
            onClick={handleResetSettings}
            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;