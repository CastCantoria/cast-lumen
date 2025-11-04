import React, { useState } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const PlatformSettings = () => {
  const { hasPermission } = usePermissions();
  const [settings, setSettings] = useState({
    siteName: 'C.A.S.T. Chorale',
    siteDescription: 'Chorale Spirituelle et Artistique',
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'mp3']
  });

  const handleSave = async () => {
    // Implémentation Firebase à ajouter
    console.log('Sauvegarde des paramètres:', settings);
    alert('Paramètres sauvegardés avec succès !');
  };

  if (!hasPermission('platform:manage')) {
    return <div>Accès refusé</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Paramètres de la Plateforme</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres Généraux */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">🌐 Configuration Générale</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Paramètres Système */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">🔧 Paramètres Système</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mode Maintenance
                </label>
                <p className="text-sm text-gray-500">Bloque l'accès public au site</p>
              </div>
              <button
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.maintenanceMode ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Inscriptions utilisateurs
                </label>
                <p className="text-sm text-gray-500">Autoriser les nouvelles inscriptions</p>
              </div>
              <button
                onClick={() => setSettings({...settings, userRegistration: !settings.userRegistration})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.userRegistration ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.userRegistration ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Paramètres Fichiers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">📁 Gestion des Fichiers</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille maximale des fichiers (MB)
              </label>
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Types de fichiers autorisés
              </label>
              <div className="flex flex-wrap gap-2">
                {settings.allowedFileTypes.map((type, index) => (
                  <span key={type} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {type}
                    <button
                      onClick={() => {
                        const newTypes = settings.allowedFileTypes.filter((_, i) => i !== index);
                        setSettings({...settings, allowedFileTypes: newTypes});
                      }}
                      className="ml-2 hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">🚀 Actions Rapides</h3>
          
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Vider le cache
            </button>
            <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors">
              Regénérer les index
            </button>
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
              Purger les logs
            </button>
          </div>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-colors font-medium"
        >
          Sauvegarder les paramètres
        </button>
      </div>
    </div>
  );
};

export default PlatformSettings;