// src/pages/dashboard/super-admin/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// Composants Super Admin
import PlatformSettings from './components/PlatformSettings';
import UserManagement from './components/UserManagement';
import SystemAnalytics from './components/SystemAnalytics';
import BackupRestore from './components/BackupRestore';
import SecurityMonitoring from './components/SecurityMonitoring';
import AdvancedReporting from './components/AdvancedReporting';
import AdminAuditLog from './components/AdminAuditLog';

// Icônes améliorées
const DashboardIcon = () => <span>👑</span>;
const UsersIcon = () => <span>👥</span>;
const PlatformIcon = () => <span>⚙️</span>;
const AnalyticsIcon = () => <span>📊</span>;
const BackupIcon = () => <span>💾</span>;
const SecurityIcon = () => <span>🔒</span>;
const ReportsIcon = () => <span>📋</span>;
const AuditIcon = () => <span>👁️</span>;
const RefreshIcon = () => <span>🔄</span>;

const SuperAdminDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeAdmins: 0,
    superAdmins: 0,
    storageUsed: '0 MB',
    systemHealth: 'optimal',
    activeEvents: 0,
    totalOrganizations: 0,
    databaseSize: '0 MB'
  });
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // États pour la gestion des utilisateurs
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    vocalRange: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1
  });

  // 🧭 Définition des onglets Super Admin
  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: <DashboardIcon />, component: SystemAnalytics, permission: 'analytics:view_global' },
    { id: 'users', name: 'Gestion Utilisateurs', icon: <UsersIcon />, component: UserManagement, permission: 'users:manage_all' },
    { id: 'platform', name: 'Plateforme', icon: <PlatformIcon />, component: PlatformSettings, permission: 'platform:manage' },
    { id: 'analytics', name: 'Analytics', icon: <AnalyticsIcon />, component: SystemAnalytics, permission: 'analytics:view_global' },
    { id: 'backup', name: 'Sauvegarde', icon: <BackupIcon />, component: BackupRestore, permission: 'data:backup_restore' },
    { id: 'security', name: 'Sécurité', icon: <SecurityIcon />, component: SecurityMonitoring, permission: 'security:monitor' },
    { id: 'reports', name: 'Rapports', icon: <ReportsIcon />, component: AdvancedReporting, permission: 'reports:generate' },
    { id: 'audit', name: 'Audit', icon: <AuditIcon />, component: AdminAuditLog, permission: 'audit:view' },
  ];

  const filteredTabs = tabs.filter(tab => hasPermission(tab.permission));
  const ActiveComponent = filteredTabs.find(tab => tab.id === activeTab)?.component;

  useEffect(() => {
    fetchRealData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allUsers, filters, sortConfig]);

  const fetchRealData = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les utilisateurs avec plus de détails
      const allUsersQuery = collection(db, 'users');
      const allUsersSnapshot = await getDocs(allUsersQuery);
      const allUsers = allUsersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || doc.data().createdAt?.toDate?.() || new Date(),
        lastLogin: doc.data().lastLogin || doc.data().updatedAt?.toDate?.() || null
      }));
      
      // Compter les différents types d'utilisateurs
      const superAdmins = allUsers.filter(user => user.role === 'super-admin');
      const admins = allUsers.filter(user => user.role === 'admin');
      const members = allUsers.filter(user => user.role === 'member');
      const regularUsers = allUsers.filter(user => user.role === 'user');

      setSystemStats({
        totalUsers: allUsers.length,
        activeAdmins: admins.length,
        superAdmins: superAdmins.length,
        storageUsed: '2.4 GB',
        systemHealth: 'optimal',
        activeEvents: 23,
        totalOrganizations: 15,
        databaseSize: '156 MB'
      });

      setAllUsers(allUsers);
      setFilteredUsers(allUsers);

    } catch (err) {
      console.error('Erreur:', err);
      setError(`Erreur de chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // FONCTIONS DE GESTION DES UTILISATEURS (identique à Admin mais avec plus de pouvoir)
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const applySort = (users) => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      switch (sortConfig.key) {
        case 'isActive':
          if (aValue === bValue) return 0;
          if (sortConfig.direction === 'asc') {
            return aValue ? -1 : 1;
          } else {
            return aValue ? 1 : -1;
          }

        case 'role':
          const roleOrder = { 'super-admin': 0, 'admin': 1, 'member': 2, 'user': 3 };
          const aRoleOrder = roleOrder[aValue] ?? 4;
          const bRoleOrder = roleOrder[bValue] ?? 4;
          
          if (sortConfig.direction === 'asc') {
            return aRoleOrder - bRoleOrder;
          } else {
            return bRoleOrder - aRoleOrder;
          }

        case 'vocalRange':
          const vocalOrder = { 
            'soprano': 0, 'mezzo-soprano': 1, 'alto': 2, 'contralto': 3,
            'tenor': 4, 'baritone': 5, 'bass': 6 
          };
          const aVocalOrder = vocalOrder[aValue] ?? 7;
          const bVocalOrder = vocalOrder[bValue] ?? 7;
          
          if (sortConfig.direction === 'asc') {
            return aVocalOrder - bVocalOrder;
          } else {
            return bVocalOrder - aVocalOrder;
          }

        default:
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
      }
    });
  };

  const applyFilters = () => {
    let filtered = [...allUsers];

    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.displayName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower) ||
        user.vocalRange?.toLowerCase().includes(searchLower) ||
        user.mission?.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par rôle système
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Filtre par rôle vocal
    if (filters.vocalRange) {
      filtered = filtered.filter(user => user.vocalRange === filters.vocalRange);
    }

    // Filtre par statut
    if (filters.status) {
      filtered = filtered.filter(user => 
        (filters.status === 'active' && user.isActive !== false) ||
        (filters.status === 'inactive' && user.isActive === false)
      );
    }

    // Appliquer le tri
    filtered = applySort(filtered);

    setFilteredUsers(filtered);
    updatePagination(filtered);
  };

  const updatePagination = (users = filteredUsers) => {
    const totalPages = Math.ceil(users.length / pagination.itemsPerPage);
    setPagination(prev => ({
      ...prev,
      totalPages,
      currentPage: prev.currentPage > totalPages ? 1 : prev.currentPage
    }));
  };

  const getCurrentPageUsers = () => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // 🔥 POUVOIRS ÉTENDUS POUR SUPER ADMIN
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditFormData({
      displayName: user.displayName || '',
      role: user.role || 'user',
      email: user.email || '',
      vocalRange: user.vocalRange || '',
      mission: user.mission || '',
      isActive: user.isActive !== false
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      const userToUpdate = allUsers.find(user => user.id === userId);
      
      // Super Admin peut tout modifier, y compris les autres Super Admins
      // Mais on empêche quand même l'auto-modification du rôle
      if (userId === userProfile.id && editFormData.role !== 'super-admin') {
        setError('En tant que Super Admin, vous devez conserver le rôle Super Admin');
        return;
      }

      await updateDoc(doc(db, 'users', userId), {
        ...editFormData,
        updatedAt: new Date().toISOString()
      });

      // Mettre à jour l'état local
      setAllUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...editFormData } : user
      ));

      setEditingUser(null);
      setEditFormData({});
      setError(null);
      setSuccess('Utilisateur mis à jour avec succès');
    } catch (err) {
      console.error('Erreur mise à jour:', err);
      setError(`Erreur lors de la mise à jour: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({});
  };

  const handleDelete = async (userId) => {
    try {
      const userToDelete = allUsers.find(user => user.id === userId);
      
      // Super Admin peut supprimer n'importe qui SAUF lui-même
      if (userId === userProfile.id) {
        setError('Vous ne pouvez pas supprimer votre propre compte');
        setDeleteConfirm(null);
        return;
      }

      await deleteDoc(doc(db, 'users', userId));
      
      // Mettre à jour l'état local
      setAllUsers(prev => prev.filter(user => user.id !== userId));
      setDeleteConfirm(null);
      setError(null);
      setSuccess('Utilisateur supprimé avec succès');
    } catch (err) {
      console.error('Erreur suppression:', err);
      setError(`Erreur lors de la suppression: ${err.message}`);
    }
  };

  const createMissingAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const adminAccounts = [
        {
          email: 'ad-castcantoria@outlook.fr',
          displayName: 'Super Administrateur CAST',
          role: 'super-admin',
          vocalRange: '',
          mission: 'Supervision générale de la plateforme',
          isActive: true
        },
        {
          email: 'livaramanalinarivo16@gmail.com',
          displayName: 'Liva Ramanalinarivo',
          role: 'admin',
          vocalRange: '',
          mission: 'Président fondateur',
          isActive: true
        },
        {
          email: 'eric.rasamimanana@gmail.com',
          displayName: 'Eric Rasamimanana',
          role: 'admin', 
          vocalRange: '',
          mission: 'Programmation Artistique',
          isActive: true
        },
        {
          email: 'tena.solution@gmail.com',
          displayName: 'Sandiniaina Alain RAMAROSON',
          role: 'admin',
          vocalRange: '',
          mission: 'Communication & Contenu',
          isActive: true
        },
        {
          email: 'julesrandriamanantsoa@gmail.com',
          displayName: 'Jules Randriamanantsoa',
          role: 'admin',
          vocalRange: '',
          mission: 'Gestion des Membres',
          isActive: true
        },
        {
          email: 'positifaid@live.fr', 
          displayName: 'Tovoniaina Rahendrison',
          role: 'admin',
          vocalRange: '',
          mission: 'Support Technique',
          isActive: true
        }
      ];

      let createdCount = 0;
      let existingCount = 0;
      let errors = [];

      for (const account of adminAccounts) {
        try {
          // Vérifier si l'utilisateur existe déjà
          const usersQuery = query(collection(db, 'users'), where('email', '==', account.email));
          const userSnapshot = await getDocs(usersQuery);
          
          if (userSnapshot.empty) {
            // Créer un document utilisateur
            const userRef = doc(collection(db, 'users'));
            await setDoc(userRef, {
              ...account,
              id: userRef.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            createdCount++;
            console.log(`✅ ${account.email} créé`);
          } else {
            // Mettre à jour l'utilisateur existant
            const existingUser = userSnapshot.docs[0];
            await updateDoc(existingUser.ref, {
              role: account.role,
              displayName: account.displayName,
              mission: account.mission,
              updatedAt: new Date().toISOString()
            });
            existingCount++;
            console.log(`🔄 ${account.email} mis à jour`);
          }
        } catch (error) {
          console.error(`❌ Erreur pour ${account.email}:`, error);
          errors.push(`${account.email}: ${error.message}`);
        }
      }
      
      if (errors.length > 0) {
        setError(`Erreurs lors de la création: ${errors.join('; ')}`);
      } else {
        setSuccess(`${createdCount} comptes admin créés, ${existingCount} existaient/mis à jour`);
      }
      
      // Recharger les données
      fetchRealData();
    } catch (err) {
      setError(`Erreur lors de la création des admins: ${err.message}`);
    }
  };

  // Composant Carte de Statistique Super Admin
  const StatCard = ({ icon, title, value, subtitle, color, loading }) => {
    const colorClasses = {
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
      gold: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' }
    };

    const colorClass = colorClasses[color] || colorClasses.purple;

    return (
      <div className={`bg-white rounded-lg shadow-sm border ${colorClass.border} p-4 sm:p-6 transition-transform hover:translate-y-[-2px] hover:shadow-md`}>
        <div className="flex items-center mb-3">
          <div className={`${colorClass.text} mr-3 text-lg sm:text-xl`}>
            {icon}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            <div className={`text-2xl sm:text-3xl font-bold ${colorClass.text} mb-1`}>
              {value}
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">{subtitle}</p>
          </>
        )}
      </div>
    );
  };

  // Composant En-tête de tableau avec tri
  const SortableHeader = ({ label, sortKey, currentSort }) => {
    const isSorted = currentSort.key === sortKey;
    const isAsc = currentSort.direction === 'asc';
    
    return (
      <th 
        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
        onClick={() => handleSort(sortKey)}
      >
        <div className="flex items-center gap-1">
          {label}
          <span className={`transition-opacity ${isSorted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isSorted ? (
              <span className="text-gray-600">
                {isAsc ? '↑' : '↓'}
              </span>
            ) : (
              <span className="text-gray-300">↕</span>
            )}
          </span>
        </div>
      </th>
    );
  };

  // 🔐 Vérification des permissions SUPER ADMIN
  if (!hasPermission('platform:manage')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Refusé</h1>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
          </p>
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au tableau de bord
          </a>
        </div>
      </div>
    );
  }

  // Rendu du contenu selon l'onglet actif
  const renderContent = () => {
    if (activeTab === 'users') {
      return (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion Complète des Utilisateurs</h2>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredUsers.length} utilisateurs
              </span>
              <button 
                onClick={fetchRealData}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
              >
                <RefreshIcon />
                <span className="ml-2">Actualiser</span>
              </button>
              <button 
                onClick={createMissingAdmins}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
              >
                <span className="mr-2">➕</span>
                Créer Admins
              </button>
            </div>
          </div>

          {/* Filtres avancés */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Recherche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                <input
                  type="text"
                  placeholder="Nom, email, rôle, mission..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Filtre Rôle système */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle système</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Tous les rôles</option>
                  <option value="super-admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="member">Membre</option>
                  <option value="user">Utilisateur</option>
                </select>
              </div>

              {/* Filtre Voix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voix</label>
                <select
                  value={filters.vocalRange}
                  onChange={(e) => handleFilterChange('vocalRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Toutes les voix</option>
                  <option value="soprano">Soprano</option>
                  <option value="mezzo-soprano">Mezzo-Soprano</option>
                  <option value="alto">Alto</option>
                  <option value="contralto">Contralto</option>
                  <option value="tenor">Ténor</option>
                  <option value="baritone">Baryton</option>
                  <option value="bass">Basse</option>
                </select>
              </div>

              {/* Filtre Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tableau des utilisateurs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortableHeader 
                      label="Utilisateur" 
                      sortKey="displayName" 
                      currentSort={sortConfig} 
                    />
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <SortableHeader 
                      label="Rôle" 
                      sortKey="role" 
                      currentSort={sortConfig} 
                    />
                    <SortableHeader 
                      label="Voix" 
                      sortKey="vocalRange" 
                      currentSort={sortConfig} 
                    />
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mission
                    </th>
                    <SortableHeader 
                      label="Statut" 
                      sortKey="isActive" 
                      currentSort={sortConfig} 
                    />
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentPageUsers().map((user) => {
                    const isCurrentUser = user.id === userProfile.id;
                    const isSuperAdmin = user.role === 'super-admin';

                    return (
                      <tr key={user.id} className={`hover:bg-gray-50 ${isSuperAdmin ? 'bg-purple-50' : ''}`}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </div>
                            <div className="ml-4">
                              {editingUser === user.id ? (
                                <input
                                  type="text"
                                  value={editFormData.displayName}
                                  onChange={(e) => setEditFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                  className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
                                  placeholder="Nom"
                                />
                              ) : (
                                <div className="text-sm font-medium text-gray-900">
                                  {user.displayName || 'Nom non renseigné'}
                                  {isCurrentUser && <span className="ml-2 text-purple-600 text-xs">(Vous)</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <input
                              type="email"
                              value={editFormData.email}
                              onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                              className="px-2 py-1 border border-gray-300 rounded text-sm w-40"
                              placeholder="Email"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">{user.email}</div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <select
                              value={editFormData.role}
                              onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="user">Utilisateur</option>
                              <option value="member">Membre</option>
                              <option value="admin">Admin</option>
                              <option value="super-admin">Super Admin</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'super-admin' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'member' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role || 'user'}
                              {isSuperAdmin && ' 👑'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <select
                              value={editFormData.vocalRange || ''}
                              onChange={(e) => setEditFormData(prev => ({ ...prev, vocalRange: e.target.value }))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="">Non spécifié</option>
                              <option value="soprano">Soprano</option>
                              <option value="mezzo-soprano">Mezzo-Soprano</option>
                              <option value="alto">Alto</option>
                              <option value="contralto">Contralto</option>
                              <option value="tenor">Ténor</option>
                              <option value="baritone">Baryton</option>
                              <option value="bass">Basse</option>
                            </select>
                          ) : (
                            user.vocalRange ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {user.vocalRange}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {editingUser === user.id ? (
                            <input
                              type="text"
                              value={editFormData.mission || ''}
                              onChange={(e) => setEditFormData(prev => ({ ...prev, mission: e.target.value }))}
                              className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
                              placeholder="Mission"
                            />
                          ) : (
                            <div className="text-sm text-gray-900 max-w-xs truncate" title={user.mission}>
                              {user.mission || '-'}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <select
                              value={editFormData.isActive ? 'active' : 'inactive'}
                              onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="active">Actif</option>
                              <option value="inactive">Inactif</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isActive === false 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.isActive === false ? 'Inactif' : 'Actif'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveEdit(user.id)}
                                className="text-green-600 hover:text-green-800 transition-colors p-1 rounded hover:bg-green-50"
                                title="Sauvegarder"
                              >
                                💾
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                                title="Annuler"
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                                title="Modifier"
                              >
                                ✏️
                              </button>
                              {!isCurrentUser && (
                                <button
                                  onClick={() => setDeleteConfirm(user.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                                  title="Supprimer"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> à <span className="font-medium">{Math.min(pagination.currentPage * pagination.itemsPerPage, filteredUsers.length)}</span> sur <span className="font-medium">{filteredUsers.length}</span> résultats
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                          className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                            page === pagination.currentPage
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun utilisateur trouvé</p>
                <button 
                  onClick={createMissingAdmins}
                  className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Créer les comptes administrateurs manquants
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Pour les autres onglets, utiliser les composants spécifiques
    return ActiveComponent ? <ActiveComponent /> : (
      <div className="p-6 text-center">
        <p className="text-gray-500">Section en développement</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎨 Header Super Admin */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Super Admin Dashboard</h1>
              <p className="text-purple-200 mt-1">Administration complète de la plateforme C.A.S.T.</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                <span className="mr-2">👑</span>
                SUPER ADMIN
              </span>
              <div className="text-right">
                <p className="text-sm text-purple-200">Connecté en tant que</p>
                <p className="font-semibold">{userProfile?.displayName || userProfile?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 Navigation par onglets */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="flex overflow-x-auto px-4 sm:px-6 lg:px-8">
            {filteredTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Messages d'alerte */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">❌</div>
              <p className="text-red-800 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-green-600 mr-3">✅</div>
              <p className="text-green-800 text-sm">{success}</p>
              <button
                onClick={() => setSuccess(null)}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📊 Statistiques système (seulement pour l'overview) */}
      {activeTab === 'overview' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon="👥"
              title="Utilisateurs totaux"
              value={systemStats.totalUsers}
              subtitle="Inclut tous les rôles"
              color="purple"
              loading={loading}
            />
            <StatCard
              icon="👑"
              title="Super Admins"
              value={systemStats.superAdmins}
              subtitle="Administrateurs suprêmes"
              color="gold"
              loading={loading}
            />
            <StatCard
              icon="⚙️"
              title="Administrateurs"
              value={systemStats.activeAdmins}
              subtitle="Gestionnaires plateforme"
              color="blue"
              loading={loading}
            />
            <StatCard
              icon="💾"
              title="Stockage"
              value={systemStats.storageUsed}
              subtitle="Espace utilisé"
              color="green"
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* 🧱 Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && activeTab === 'overview' ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;