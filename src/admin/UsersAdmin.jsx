import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UsersAdmin = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Charger les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        // Fallback avec données de démonstration
        const demoUsers = getDemoUsers();
        setUsers(demoUsers);
      } catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
        const demoUsers = getDemoUsers();
        setUsers(demoUsers);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Données de démonstration complètes
  const getDemoUsers = () => {
    return [
      // Super Admin
      {
        id: 'super-admin-1',
        email: 'ad-castcantoria@outlook.fr',
        firstName: 'Super',
        lastName: 'Administrateur',
        role: 'super-admin',
        status: 'active',
        responsibility: '👑 Supervision générale de la plateforme',
        phoneNumber: '+261 34 11 361 57',
        createdAt: { seconds: 1705334400 },
        lastLoginAt: { seconds: Date.now() / 1000 }
      },
      // Administrateurs
      {
        id: 'admin-1',
        email: 'eric.rasamimanana@gmail.com',
        firstName: 'Éric',
        lastName: 'RASAMIMANANA',
        role: 'admin',
        status: 'active',
        responsibility: '🎵 Programmation Artistique',
        phoneNumber: '+261 34 11 361 57',
        createdAt: { seconds: 1705334400 },
        lastLoginAt: { seconds: (Date.now() - 86400000) / 1000 }
      },
      {
        id: 'admin-2',
        email: 'tena.solution@gmail.com',
        firstName: 'Tena',
        lastName: 'Solution',
        role: 'admin',
        status: 'active',
        responsibility: '📢 Communication & Contenu',
        phoneNumber: '+261 32 91 828 83',
        createdAt: { seconds: 1705334400 },
        lastLoginAt: { seconds: (Date.now() - 172800000) / 1000 }
      },
      // Choristes
      {
        id: 'member-1',
        email: 'choriste.soprano@castcantoria.org',
        firstName: 'Sophie',
        lastName: 'RANDRIANARIVELO',
        role: 'member',
        status: 'active',
        responsibility: '🎵 Choriste - Soprano',
        phoneNumber: '+261 34 00 0001',
        createdAt: { seconds: 1708000000 },
        lastLoginAt: { seconds: (Date.now() - 432000000) / 1000 }
      },
      {
        id: 'member-2',
        email: 'choriste.alto@castcantoria.org',
        firstName: 'Anja',
        lastName: 'RAZAFINDRAKOTO',
        role: 'member',
        status: 'active',
        responsibility: '🎵 Choriste - Alto',
        phoneNumber: '+261 34 00 0002',
        createdAt: { seconds: 1708000000 },
        lastLoginAt: { seconds: (Date.now() - 518400000) / 1000 }
      },
      // En attente
      {
        id: 'pending-1',
        email: 'nouveau.choriste@castcantoria.org',
        firstName: 'Léa',
        lastName: 'RASOANAIVO',
        role: 'member',
        status: 'pending',
        responsibility: '🎵 Nouveau Choriste',
        phoneNumber: '+261 34 00 0003',
        createdAt: { seconds: Date.now() / 1000 },
        lastLoginAt: { seconds: Date.now() / 1000 }
      }
    ];
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.responsibility?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Fonctions pour les badges
  const getRoleBadge = (role) => {
    const roles = {
      'super-admin': '👑 SUPER_ADMIN',
      'admin': '⚡ ADMIN',
      'member': '🎵 CHORISTE',
      'contributor': '📝 CONTRIBUTEUR', 
      'visitor': '👀 VISITEUR'
    };
    return roles[role] || role;
  };

  const getStatusBadge = (status) => {
    const statuses = {
      'active': '🟢 Actif',
      'pending': '🟡 En attente',
      'suspended': '🔴 Suspendu',
      'inactive': '⚫ Inactif'
    };
    return statuses[status] || status;
  };

  // Obtenir le nom complet
  const getFullName = (user) => {
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.displayName) return user.displayName;
    return user.email.split('@')[0];
  };

  // Formater la date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('fr-FR');
    }
    return timestamp;
  };

  // Éditer un utilisateur
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // Sauvegarder les modifications
  const handleSaveEdit = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setEditingUser(null);
    alert('✅ Utilisateur modifié avec succès');
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Confirmer la suppression
  const handleDeleteConfirm = (user) => {
    setShowDeleteConfirm(user);
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Supprimer définitivement
  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowDeleteConfirm(null);
    alert('🗑️ Utilisateur supprimé avec succès');
  };

  // Mettre à jour le rôle
  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  // Mettre à jour le statut
  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  // Statistiques
  const stats = {
    total: users.length,
    superAdmins: users.filter(u => u.role === 'super-admin').length,
    admins: users.filter(u => u.role === 'admin').length,
    members: users.filter(u => u.role === 'member').length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length
  };

  // Modal d'édition
  const EditUserModal = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState(user);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            ✏️ Modifier l'utilisateur
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsabilité
              </label>
              <input
                type="text"
                value={formData.responsibility}
                onChange={(e) => handleChange('responsibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                💾 Sauvegarder
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ❌ Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal de confirmation de suppression
  const DeleteConfirmModal = ({ user, onConfirm, onCancel }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-600 mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer l'utilisateur :
            </p>
            <p className="font-semibold text-lg mb-2">
              {getFullName(user)}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              {user.email}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onConfirm(user.id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                🗑️ Supprimer
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ↩️ Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-green-600">Chargement des membres Cast Cantoria...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            👥 Gestion des Membres - Cast Cantoria
          </h1>
          <p className="text-green-600">
            Administration complète de l'équipe et des choristes
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-600">{stats.total}</div>
            <div className="text-sm text-green-500">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.superAdmins}</div>
            <div className="text-sm text-purple-500">Super Admin</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
            <div className="text-sm text-blue-500">Admins</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.members}</div>
            <div className="text-sm text-orange-500">Choristes</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-green-500">Actifs</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-yellow-500">En attente</div>
          </div>
        </div>

        {/* Barre de filtres */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher un membre par nom, email ou rôle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">👥 Tous les rôles</option>
                <option value="super-admin">👑 Super Admin</option>
                <option value="admin">⚡ Admin</option>
                <option value="member">🎵 Choriste</option>
                <option value="contributor">📝 Contributeur</option>
              </select>
            </div>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              🔄 Actualiser
            </button>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getFullName(user)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.responsibility || 'Membre Cast Cantoria'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-xs font-medium px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                        disabled={user.role === 'super-admin'}
                      >
                        <option value="super-admin">👑 Super Admin</option>
                        <option value="admin">⚡ Admin</option>
                        <option value="member">🎵 Choriste</option>
                        <option value="contributor">📝 Contributeur</option>
                        <option value="visitor">👀 Visiteur</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {user.email}
                      </div>
                      {user.phoneNumber && (
                        <div className="text-xs text-gray-500">
                          📞 {user.phoneNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.status || 'active'}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className="text-xs font-medium px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                      >
                        <option value="active">🟢 Actif</option>
                        <option value="pending">🟡 En attente</option>
                        <option value="suspended">🔴 Suspendu</option>
                        <option value="inactive">⚫ Inactif</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900 text-xs font-medium"
                          title="Modifier l'utilisateur"
                        >
                          ✏️ Éditer
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(user)}
                          className="text-red-600 hover:text-red-900 text-xs font-medium"
                          disabled={user.role === 'super-admin'}
                          title={user.role === 'super-admin' ? 'Impossible de supprimer un Super Admin' : 'Supprimer l\'utilisateur'}
                        >
                          {user.role === 'super-admin' ? '🔒 Verrouillé' : '🗑️ Supprimer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun membre trouvé
              </h3>
              <p className="text-gray-500">
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <a 
            href="/admin" 
            className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            ← Retour au dashboard
          </a>
          
          <div className="text-sm text-gray-500">
            {filteredUsers.length} membre(s) affiché(s) sur {users.length}
          </div>
        </div>

        {/* Modals */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}

        {showDeleteConfirm && (
          <DeleteConfirmModal
            user={showDeleteConfirm}
            onConfirm={handleDelete}
            onCancel={handleCancelDelete}
          />
        )}

      </div>
    </div>
  );
};

export default UsersAdmin;