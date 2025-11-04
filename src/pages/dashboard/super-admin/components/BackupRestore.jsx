import React, { useState } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const BackupRestore = () => {
  const { hasPermission } = usePermissions();
  const [backups, setBackups] = useState([
    { id: 1, name: 'backup-2024-01-15', date: '2024-01-15', size: '245 MB', type: 'Automatique' },
    { id: 2, name: 'backup-2024-01-14', date: '2024-01-14', size: '240 MB', type: 'Automatique' },
    { id: 3, name: 'backup-2024-01-10', date: '2024-01-10', size: '238 MB', type: 'Manuel' }
  ]);

  const [restoreModal, setRestoreModal] = useState(null);

  const handleCreateBackup = async () => {
    // Implémentation Firebase à ajouter
    alert('Sauvegarde en cours...');
  };

  const handleRestore = async (backupId) => {
    // Implémentation Firebase à ajouter
    alert(`Restauration du backup ${backupId}...`);
    setRestoreModal(null);
  };

  if (!hasPermission('data:backup_restore')) {
    return <div>Accès refusé</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">💾 Sauvegarde & Restauration</h2>

      {/* Actions principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💾</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Sauvegarde Manuelle</h3>
          <p className="text-gray-600 text-sm mb-4">
            Crée une sauvegarde complète de la base de données
          </p>
          <button
            onClick={handleCreateBackup}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors w-full"
          >
            Créer Sauvegarde
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📥</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Importer</h3>
          <p className="text-gray-600 text-sm mb-4">
            Importer une sauvegarde depuis votre ordinateur
          </p>
          <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors w-full">
            Importer Backup
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Paramètres Auto</h3>
          <p className="text-gray-600 text-sm mb-4">
            Configurer les sauvegardes automatiques
          </p>
          <button className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors w-full">
            Configurer
          </button>
        </div>
      </div>

      {/* Liste des sauvegardes */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Sauvegardes Disponibles</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {backups.map((backup) => (
            <div key={backup.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600">💾</span>
                </div>
                <div>
                  <div className="font-medium">{backup.name}</div>
                  <div className="text-sm text-gray-500">
                    {backup.date} • {backup.size} • {backup.type}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setRestoreModal(backup)}
                  className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Restaurer
                </button>
                <button className="bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700 transition-colors">
                  Télécharger
                </button>
                <button className="bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700 transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de restauration */}
      {restoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">🔁 Confirmer la Restauration</h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir restaurer la sauvegarde <strong>{restoreModal.name}</strong> ? 
              Cette action écrasera toutes les données actuelles.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="text-yellow-400 mr-2">⚠️</div>
                <div className="text-sm text-yellow-800">
                  <strong>Attention:</strong> Cette action ne peut pas être annulée. 
                  Faites une sauvegarde manuelle avant de continuer.
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRestoreModal(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleRestore(restoreModal.id)}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Confirmer la Restauration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupRestore;