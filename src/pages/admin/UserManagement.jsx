import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const UserManagement = () => {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.specialite?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleEditUser = (user) => {
    // Vérification des permissions
    if (user.role === 'super-admin' && userProfile.role !== 'super-admin') {
      alert('❌ Seul un Super Admin peut modifier un autre Super Admin');
      return;
    }
    setEditingUser(user);
  };

  const handleSaveUser = async (userData) => {
    try {
      // Vérification des permissions
      if (userData.role === 'super-admin' && userProfile.role !== 'super-admin') {
        alert('❌ Seul un Super Admin peut créer/modifier un Super Admin');
        return;
      }

      const userRef = doc(db, 'users', userData.id);
      await updateDoc(userRef, {
        displayName: userData.displayName,
        role: userData.role,
        specialite: userData.specialite,
        isActive: userData.isActive,
        updatedAt: new Date()
      });
      
      setUsers(users.map(u => u.id === userData.id ? { ...u, ...userData } : u));
      setEditingUser(null);
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
    }
  };

  const handleDeleteUser = async (userId, userRole) => {
    // Vérification des permissions
    if (userRole === 'super-admin') {
      alert('❌ Impossible de supprimer un Super Admin');
      return;
    }

    if (userRole === 'admin' && userProfile.role !== 'super-admin') {
      alert('❌ Seul un Super Admin peut supprimer un Admin');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Erreur suppression utilisateur:', error);
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Email', 'Nom', 'Rôle', 'Spécialité', 'Statut', 'Date création'],
      ...filteredUsers.map(user => [
        user.id,
        user.email,
        user.displayName,
        user.role,
        user.specialite,
        user.isActive ? 'Actif' : 'Inactif',
        user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs-cast-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cast-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cast-green">Gestion des Utilisateurs</h1>
              <p className="text-gray-600 mt-2">
                Administrez les membres et leurs permissions • Votre rôle: <span className="font-semibold capitalize">{userProfile?.role}</span>
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center"
              >
                📊 Exporter CSV
              </button>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🔍 Recherche
              </label>
              <input
                type="text"
                placeholder="Nom, email, spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                👥 Rôle
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              >
                <option value="all">Tous les rôles</option>
                <option value="super-admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="membre">Membre</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📊 Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📄 Affichage
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              >
                <option value="5">5 par page</option>
                <option value="10">10 par page</option>
                <option value="20">20 par page</option>
                <option value="50">50 par page</option>
                <option value={filteredUsers.length}>Tout afficher</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={resetFilters}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
            >
              🔄 Réinitialiser les filtres
            </button>
            <div className="text-sm text-gray-600">
              {filteredUsers.length} utilisateur(s) trouvé(s)
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? ` (sur ${users.length} au total)` : ''}
            </div>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
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
                    Spécialité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-cast-green rounded-full flex items-center justify-center text-white font-bold">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.displayName || 'Non défini'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'super-admin' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        user.role === 'membre' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role || 'public'}
                        {user.role === 'super-admin' && ' 👑'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.specialite || 'Non définie'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? '✅ Actif' : '❌ Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className={`${
                          user.role === 'super-admin' && userProfile.role !== 'super-admin'
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-cast-green hover:text-cast-gold'
                        } transition-colors`}
                        disabled={user.role === 'super-admin' && userProfile.role !== 'super-admin'}
                        title={user.role === 'super-admin' && userProfile.role !== 'super-admin' ? 'Seul un Super Admin peut modifier un Super Admin' : 'Modifier'}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.role)}
                        className={`${
                          user.role === 'super-admin' || 
                          (user.role === 'admin' && userProfile.role !== 'super-admin')
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-800'
                        } transition-colors`}
                        disabled={user.role === 'super-admin' || (user.role === 'admin' && userProfile.role !== 'super-admin')}
                        title={
                          user.role === 'super-admin' 
                            ? 'Impossible de supprimer un Super Admin'
                            : user.role === 'admin' && userProfile.role !== 'super-admin'
                            ? 'Seul un Super Admin peut supprimer un Admin'
                            : 'Supprimer'
                        }
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-500">Aucun utilisateur ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages} • 
                Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredUsers.length)} 
                sur {filteredUsers.length} utilisateurs
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Précédent
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border text-sm font-medium rounded-md ${
                        currentPage === pageNum
                          ? 'bg-cast-green text-white border-cast-green'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'édition */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onSave={handleSaveUser}
            onClose={() => setEditingUser(null)}
            currentUserRole={userProfile?.role}
          />
        )}
      </div>
    </div>
  );
};

// Modal d'édition avec gestion des rôles
const EditUserModal = ({ user, onSave, onClose, currentUserRole }) => {
  const [formData, setFormData] = useState(user);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const canEditSuperAdmin = currentUserRole === 'super-admin';
  const isEditingSelf = user.id === currentUserRole?.uid;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-cast-green mb-4">Modifier l'utilisateur</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              value={formData.displayName || ''}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle
            </label>
            <select
              value={formData.role || 'public'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              disabled={formData.role === 'super-admin' && !canEditSuperAdmin}
            >
              <option value="public">Public</option>
              <option value="membre">Membre</option>
              <option value="admin">Administrateur</option>
              {canEditSuperAdmin && <option value="super-admin">Super Admin</option>}
            </select>
            {formData.role === 'super-admin' && !canEditSuperAdmin && (
              <p className="text-xs text-red-600 mt-1">
                ❌ Seul un Super Admin peut modifier ce rôle
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spécialité
            </label>
            <input
              type="text"
              value={formData.specialite || ''}
              onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold"
              placeholder="Ex: Chant, Piano, Communication..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive || false}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-cast-green focus:ring-cast-gold border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Compte actif
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cast-green text-white rounded-lg hover:bg-cast-gold transition-colors"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;