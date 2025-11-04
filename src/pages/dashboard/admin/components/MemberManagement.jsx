import React, { useState } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const MemberManagement = () => {
  const { hasPermission } = usePermissions();
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean@cast.com',
      voice: 'Ténor',
      status: 'active',
      joinDate: '2023-05-15',
      lastActivity: '2024-01-14'
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie@cast.com',
      voice: 'Soprano',
      status: 'active',
      joinDate: '2023-06-20',
      lastActivity: '2024-01-13'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  if (!hasPermission('members:manage')) {
    return <div>Accès refusé</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">👥 Gestion des Membres</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Ajouter un membre
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{members.length}</div>
          <div className="text-sm text-blue-800">Membres totaux</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {members.filter(m => m.status === 'active').length}
          </div>
          <div className="text-sm text-green-800">Actifs</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {members.filter(m => m.voice === 'Soprano').length}
          </div>
          <div className="text-sm text-purple-800">Sopranos</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {members.filter(m => m.voice === 'Ténor').length}
          </div>
          <div className="text-sm text-orange-800">Ténors</div>
        </div>
      </div>

      {/* Tableau des membres */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Voix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'adhésion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {member.voice}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.joinDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Éditer
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Ajouter un membre</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de voix
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sélectionner...</option>
                  <option value="Soprano">Soprano</option>
                  <option value="Alto">Alto</option>
                  <option value="Ténor">Ténor</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;