import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission, PERMISSIONS } from '../../../config/roles';

const Rehearsals = () => {
  const { userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(null);

  const handleAddRehearsal = () => {
    // TODO: Implémenter l'ajout d'une répétition
    console.log("Ajouter une répétition");
  };

  const handleEditRehearsal = (rehearsal) => {
    setIsEditing(rehearsal.id);
    console.log("Éditer la répétition:", rehearsal);
  };

  const handleDeleteRehearsal = (rehearsal) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la répétition du ${new Date(rehearsal.date).toLocaleDateString()}?`)) {
      // TODO: Implémenter la suppression
      console.log("Supprimer la répétition:", rehearsal);
    }
  };

  // Exemple de données (à remplacer par les vraies données de Firebase)
  const rehearsals = [
    {
      id: 1,
      date: '2025-10-15T19:00:00',
      location: 'Centre culturel',
      duration: '2h',
      program: ['Ave Maria - F. Schubert', 'Hallelujah - L. Cohen'],
      notes: "Apporter les nouvelles partitions"
    },
    {
      id: 2,
      date: '2025-10-22T19:00:00',
      location: 'Salle de musique',
      duration: '2h30',
      program: ['Gloria - A. Vivaldi', 'Requiem - W.A. Mozart'],
      notes: 'Répétition avec orchestre'
    }
  ];

  const userRole = userProfile?.role;
  const canCreate = hasPermission(userRole, PERMISSIONS.CREATE_MEMBER_CONTENT);
  const canEdit = hasPermission(userRole, PERMISSIONS.EDIT_MEMBER_CONTENT);
  const canDelete = hasPermission(userRole, PERMISSIONS.DELETE_MEMBER_CONTENT);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* En-tête */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">Répétitions</h1>
            <p className="mt-1 text-sm text-gray-500">Calendrier des répétitions et informations importantes</p>
            <div className="mt-4 flex items-center justify-end">
              {canCreate && (
                <button
                  onClick={handleAddRehearsal}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium shadow-sm"
                >
                  ➕ Ajouter une répétition
                </button>
              )}
            </div>
          </div>

          {/* Liste des répétitions */}
          <div className="divide-y divide-gray-200">
            {rehearsals.map((rehearsal) => (
              <div key={rehearsal.id} className="px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {new Date(rehearsal.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </h3>
                      <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {new Date(rehearsal.date).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Lieu:</span> {rehearsal.location}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Durée:</span> {rehearsal.duration}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Programme:</h4>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
                        {rehearsal.program.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {rehearsal.notes && (
                      <div className="mt-4 bg-yellow-50 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm text-yellow-700">{rehearsal.notes}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex items-start gap-2">
                    {canEdit && (
                      <button
                        onClick={() => handleEditRehearsal(rehearsal)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                      >
                        ✏️ Éditer
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteRehearsal(rehearsal)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200 shadow-sm"
                      >
                        🗑️ Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message si aucune répétition */}
          {rehearsals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune répétition prévue</h3>
              <p className="text-gray-500">Il n'y a pas de répétitions planifiées pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rehearsals;