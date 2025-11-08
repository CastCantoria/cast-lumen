import React, { useState, useEffect } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const UserManagement = () => {
  const { hasPermission } = usePermissions();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  // Données mockées - À remplacer par Firebase
  useEffect(() => {
    const mockUsers = [
      {
        id: '1',
        email: 'superadmin@cast.com',
        displayName: 'Admin Principal',
        role: 'super-admin',
        status: 'active',
        lastLogin: '2024-01-15',
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        email: 'admin@cast.com',
        displayName: 'Gestionnaire Chorale',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-01-14',
        createdAt: '2024-01-02'
      },
      {
        id: '3',
        email: 'membre@cast.com',
        displayName: 'Jean Dupont',
        role: 'member',
        status: 'active',
        lastLogin: '2024-01-13',
        createdAt: '2024-01-03'
      }
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    // Implémentation Firebase à ajouter
    console.log(`Changement de rôle: ${userId} -> ${newRole}`);
    alert(`Rôle modifié pour ${newRole}`);
  };

  const handleStatusChange = async (userId, newStatus) => {
    // Implémentation Firebase à ajouter
    console.log(`Changement de statut: ${userId} -> ${newStatus}`);
    alert(`Statut modifié pour ${newStatus}`);
  };

  if (!hasPermission('users:manage_all')) {
    return <div>Accès refusé</div>;
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">👥 Gestion des Utilisateurs</h2>
        <div className="text-sm text-gray-500">
          {users.length} utilisateur(s) au total
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-blue-800">Total</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'super-admin').length}
          </div>
          <div className="text-sm text-purple-800">Super Admins</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-green-800">Admins</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {users.filter(u => u.role === 'member').length}
          </div>
          <div className="text-sm text-orange-800">Membres</div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière connexion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.displayName || 'Non renseigné'}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="super-admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="member">Membre</option>
                    <option value="visitor">Visiteur</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    className={`text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      user.status === 'active' 
                        ? 'border-green-300 bg-green-50 text-green-800'
                        : 'border-red-300 bg-red-50 text-red-800'
                    }`}
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-purple-600 hover:text-purple-900 mr-3"
                  >
                    Détails
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

      {/* Modal de détails */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Détails de l'utilisateur</h3>
            <div className="space-y-2">
              <p><strong>Nom:</strong> {selectedUser.displayName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Rôle:</strong> {selectedUser.role}</p>
              <p><strong>Statut:</strong> {selectedUser.status}</p>
              <p><strong>Créé le:</strong> {selectedUser.createdAt}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;