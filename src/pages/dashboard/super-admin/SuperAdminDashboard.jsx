import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// Composants Dashboard simplifiés (copiés depuis AdminDashboard)
const EventsDashboard = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">🎭 Gestion des Événements</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-blue-600">3</p>
        <p className="text-sm text-blue-900">Événements</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-green-600">45</p>
        <p className="text-sm text-green-900">Participants</p>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-orange-600">2</p>
        <p className="text-sm text-orange-900">À modérer</p>
      </div>
    </div>
  </div>
);

const ContentDashboard = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">📝 Gestion du Contenu</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-purple-600">12</p>
        <p className="text-sm text-purple-900">Articles</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-blue-600">24</p>
        <p className="text-sm text-blue-900">Médias</p>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-yellow-600">5</p>
        <p className="text-sm text-yellow-900">En attente</p>
      </div>
    </div>
  </div>
);

const RepertoireDashboard = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">🎼 Gestion du Répertoire</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-green-600">56</p>
        <p className="text-sm text-green-900">Pièces</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-blue-600">42</p>
        <p className="text-sm text-blue-900">Partitions</p>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-red-600">8</p>
        <p className="text-sm text-red-900">À numériser</p>
      </div>
    </div>
  </div>
);

const StatisticsDashboard = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">📈 Statistiques</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
        <p className="text-xl font-bold text-indigo-600">1.2K</p>
        <p className="text-xs text-indigo-900">Visites</p>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
        <p className="text-xl font-bold text-purple-600">68%</p>
        <p className="text-xs text-purple-900">Engagement</p>
      </div>
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
        <p className="text-xl font-bold text-pink-600">23</p>
        <p className="text-xs text-pink-900">Nouveaux</p>
      </div>
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
        <p className="text-xl font-bold text-teal-600">12%</p>
        <p className="text-xs text-teal-900">Conversion</p>
      </div>
    </div>
  </div>
);

// Icônes
const DashboardIcon = () => <span>📊</span>;
const UsersIcon = () => <span>👥</span>;
const EventsIcon = () => <span>🎭</span>;
const ContentIcon = () => <span>📝</span>;
const RepertoireIcon = () => <span>🎼</span>;
const StatsIcon = () => <span>📈</span>;
const RefreshIcon = () => <span>🔄</span>;

const SuperAdminDashboard = () => {
  const { userProfile, currentUser, logout } = useAuth();
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    superAdminCount: 0,
    activeEvents: 0,
    pendingContent: 0,
  });
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    itemsPerPage: 8,
    totalPages: 1
  });

  // NOUVEAUX ÉTATS POUR LES SESSIONS ACTIVES
  const [activeSessions, setActiveSessions] = useState([]);
  const [sessionSort, setSessionSort] = useState({
    key: 'lastActivity',
    direction: 'desc'
  });

  // Configuration de navigation
  const menuItems = [
    { id: 'overview', name: 'Aperçu', icon: <DashboardIcon />, color: 'purple' },
    { id: 'users', name: 'Utilisateurs', icon: <UsersIcon />, color: 'green' },
    { id: 'events', name: 'Événements', icon: <EventsIcon />, color: 'orange' },
    { id: 'content', name: 'Contenu', icon: <ContentIcon />, color: 'blue' },
    { id: 'repertoire', name: 'Répertoire', icon: <RepertoireIcon />, color: 'pink' },
    { id: 'stats', name: 'Statistiques', icon: <StatsIcon />, color: 'red' },
  ];

  useEffect(() => {
    fetchRealData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allUsers, filters, sortConfig]);

  // FONCTIONS POUR LES SESSIONS ACTIVES
  const calculateDuration = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleSessionSort = (key) => {
    let direction = 'asc';
    if (sessionSort.key === key && sessionSort.direction === 'asc') {
      direction = 'desc';
    }
    setSessionSort({ key, direction });
  };

  const sortedActiveSessions = [...activeSessions].sort((a, b) => {
    if (!sessionSort.key) return 0;
    
    let aValue = a[sessionSort.key];
    let bValue = b[sessionSort.key];
    
    if (aValue == null) aValue = '';
    if (bValue == null) bValue = '';
    
    if (sessionSort.key === 'loginTime' || sessionSort.key === 'lastActivity') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (aValue < bValue) {
      return sessionSort.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sessionSort.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const fetchRealData = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les utilisateurs
      const allUsersQuery = collection(db, 'users');
      const allUsersSnapshot = await getDocs(allUsersQuery);
      const allUsers = allUsersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Compter les différents types d'utilisateurs
      const superAdmins = allUsers.filter(user => user.role === 'super-admin');
      const adminUsers = allUsers.filter(user => user.role === 'admin');
      const members = allUsers.filter(user => user.role === 'member');

      // Simuler des sessions actives
      const mockActiveSessions = allUsers.slice(0, 8).map((user, index) => ({
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        loginTime: new Date(Date.now() - (index * 30 * 60 * 1000)).toISOString(),
        lastActivity: new Date().toISOString(),
        isActive: index < 5
      }));

      setSystemStats({
        totalUsers: allUsers.length,
        adminCount: adminUsers.length,
        superAdminCount: superAdmins.length,
        activeEvents: 0,
        pendingContent: 0,
      });

      setAllUsers(allUsers);
      setFilteredUsers(allUsers);
      setActiveSessions(mockActiveSessions);

    } catch (err) {
      console.error('Erreur:', err);
      setError(`Erreur de chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // FONCTIONS DE GESTION DES UTILISATEURS
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

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.displayName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower) ||
        user.vocalRange?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    if (filters.vocalRange) {
      filtered = filtered.filter(user => user.vocalRange === filters.vocalRange);
    }

    if (filters.status) {
      filtered = filtered.filter(user => 
        (filters.status === 'active' && user.isActive !== false) ||
        (filters.status === 'inactive' && user.isActive === false)
      );
    }

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

  // 🔥 POUVOIRS SUPER ADMIN ÉTENDUS
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
      
      // Super Admin peut tout modifier SAUF son propre rôle
      if (userId === userProfile.id && editFormData.role !== 'super-admin') {
        setError('Vous devez conserver le rôle Super Admin');
        return;
      }

      await updateDoc(doc(db, 'users', userId), {
        ...editFormData,
        updatedAt: new Date().toISOString()
      });

      setAllUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...editFormData } : user
      ));

      setEditingUser(null);
      setEditFormData({});
      setError(null);
      setSuccess('Utilisateur mis à jour avec succès');
    } catch (err) {
      setError(`Erreur lors de la mise à jour: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({});
  };

  // 🔥 FONCTION PROMOTION RAPIDE
  const promoteUser = async (userId, newRole) => {
    try {
      const userToPromote = allUsers.find(user => user.id === userId);
      
      if (userId === userProfile.id && newRole !== 'super-admin') {
        setError('Vous ne pouvez pas modifier votre propre rôle Super Admin');
        return;
      }

      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });

      setAllUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      setSuccess(`🎉 ${userToPromote.displayName} promu au rôle ${newRole} !`);
    } catch (err) {
      setError(`Erreur lors de la promotion: ${err.message}`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      if (userId === userProfile.id) {
        setError('Vous ne pouvez pas supprimer votre propre compte');
        setDeleteConfirm(null);
        return;
      }

      await deleteDoc(doc(db, 'users', userId));
      
      setAllUsers(prev => prev.filter(user => user.id !== userId));
      setDeleteConfirm(null);
      setError(null);
      setSuccess('Utilisateur supprimé avec succès');
    } catch (err) {
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

      for (const account of adminAccounts) {
        try {
          const usersQuery = query(collection(db, 'users'), where('email', '==', account.email));
          const userSnapshot = await getDocs(usersQuery);
          
          if (userSnapshot.empty) {
            const userRef = doc(collection(db, 'users'));
            await setDoc(userRef, {
              ...account,
              id: userRef.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            createdCount++;
          } else {
            const existingUser = userSnapshot.docs[0];
            await updateDoc(existingUser.ref, {
              role: account.role,
              displayName: account.displayName,
              mission: account.mission,
              updatedAt: new Date().toISOString()
            });
            existingCount++;
          }
        } catch (error) {
          console.error(`Erreur pour ${account.email}:`, error);
        }
      }
      
      setSuccess(`${createdCount} comptes admin créés, ${existingCount} existaient/mis à jour`);
      fetchRealData();
    } catch (err) {
      setError(`Erreur lors de la création des admins: ${err.message}`);
    }
  };

  // Composants d'interface
  const StatCard = ({ icon, title, value, subtitle, color, loading }) => {
    const colorClasses = {
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' }
    };

    const colorClass = colorClasses[color] || colorClasses.purple;

    return (
      <div className={`bg-white rounded-lg shadow-sm border ${colorClass.border} p-3 sm:p-4 lg:p-6 transition-transform hover:translate-y-[-2px] hover:shadow-md`}>
        <div className="flex items-center mb-2 sm:mb-3">
          <div className={`${colorClass.text} mr-2 sm:mr-3 text-base sm:text-lg lg:text-xl`}>
            {icon}
          </div>
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">{title}</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-1 sm:py-2">
            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${colorClass.text} mb-1`}>
              {value}
            </div>
            <p className="text-gray-600 text-xs sm:text-sm truncate">{subtitle}</p>
          </>
        )}
      </div>
    );
  };

  const SortableHeader = ({ label, sortKey, currentSort }) => {
    const isSorted = currentSort.key === sortKey;
    const isAsc = currentSort.direction === 'asc';
    
    return (
      <th 
        className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
        onClick={() => handleSort(sortKey)}
      >
        <div className="flex items-center gap-1">
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden text-xs">{label.substring(0, 3)}</span>
          <span className={`transition-opacity ${isSorted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isSorted ? (
              <span className="text-gray-600 text-xs">
                {isAsc ? '↑' : '↓'}
              </span>
            ) : (
              <span className="text-gray-300 text-xs">↕</span>
            )}
          </span>
        </div>
      </th>
    );
  };

  const QuickPromoteButton = ({ user, currentUserProfile }) => {
    const isCurrentUser = user.id === currentUserProfile.id;
    
    if (isCurrentUser) {
      return (
        <span className="text-xs text-gray-400" title="Vous ne pouvez pas modifier votre propre rôle">
          🔒
        </span>
      );
    }

    const getNextRole = (currentRole) => {
      switch (currentRole) {
        case 'user': return { role: 'member', label: 'Membre', color: 'green' };
        case 'member': return { role: 'admin', label: 'Admin', color: 'red' };
        case 'admin': return { role: 'super-admin', label: 'Super', color: 'purple' };
        case 'super-admin': return { role: 'admin', label: 'Retour', color: 'orange' };
        default: return { role: 'member', label: 'Membre', color: 'green' };
      }
    };

    const nextRole = getNextRole(user.role);
    const isDemotion = user.role === 'super-admin' && nextRole.role === 'admin';

    return (
      <button
        onClick={() => promoteUser(user.id, nextRole.role)}
        className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-medium transition-colors ${
          isDemotion 
            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
            : `bg-${nextRole.color}-100 text-${nextRole.color}-700 hover:bg-${nextRole.color}-200`
        }`}
        title={`${isDemotion ? 'Rétrograder' : 'Promouvoir'} en ${nextRole.label}`}
      >
        <span className="hidden sm:inline">{isDemotion ? '⬇️' : '⬆️'} {nextRole.label}</span>
        <span className="sm:hidden">{isDemotion ? '⬇️' : '⬆️'}</span>
      </button>
    );
  };

  // FONCTION RENDERCONTENT AVEC SESSIONS ACTIVES
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div>
            {/* Informations Super Admin */}
            <div className="bg-gradient-to-r from-purple-50 to-yellow-50 border border-purple-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-purple-900 mb-1 sm:mb-2">👑 Panel Super Administrateur</h3>
              <p className="text-purple-800 text-sm sm:text-base">
                <strong>Pouvoirs étendus :</strong> Gestion complète de tous les utilisateurs.
              </p>
            </div>

            {/* Grille des statistiques */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <StatCard
                icon="👥"
                title="Utilisateurs"
                value={systemStats.totalUsers}
                subtitle="Total"
                color="green"
                loading={loading}
              />
              <StatCard
                icon="👑"
                title="Super Admins"
                value={systemStats.superAdminCount}
                subtitle="Suprêmes"
                color="purple"
                loading={loading}
              />
              <StatCard
                icon="⚙️"
                title="Admins"
                value={systemStats.adminCount}
                subtitle="Gestionnaires"
                color="blue"
                loading={loading}
              />
              <StatCard
                icon="📝"
                title="En attente"
                value={systemStats.pendingContent}
                subtitle="Contenu"
                color="orange"
                loading={loading}
              />
            </div>

            {/* SECTION SESSIONS ACTIVES */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Sessions Actives</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {activeSessions.length} connecté(s)
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSessionSort('displayName')}>
                        <div className="flex items-center gap-1">
                          Utilisateur
                          <span className="text-gray-300">{sessionSort.key === 'displayName' ? (sessionSort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSessionSort('role')}>
                        <div className="flex items-center gap-1">
                          Rôle
                          <span className="text-gray-300">{sessionSort.key === 'role' ? (sessionSort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSessionSort('loginTime')}>
                        <div className="flex items-center gap-1">
                          Début
                          <span className="text-gray-300">{sessionSort.key === 'loginTime' ? (sessionSort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSessionSort('lastActivity')}>
                        <div className="flex items-center gap-1">
                          Dernière activité
                          <span className="text-gray-300">{sessionSort.key === 'lastActivity' ? (sessionSort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durée
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedActiveSessions.map((session, index) => (
                      <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {session.displayName?.charAt(0) || session.email?.charAt(0) || 'U'}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {session.displayName || 'Non renseigné'}
                                {session.id === userProfile.id && (
                                  <span className="ml-2 text-blue-600 text-xs">(Vous)</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                {session.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.role === 'super-admin' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                            session.role === 'admin' ? 'bg-red-100 text-red-800' :
                            session.role === 'member' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {session.role || 'user'}
                            {session.role === 'super-admin' && ' 👑'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {session.loginTime ? new Date(session.loginTime).toLocaleTimeString('fr-FR') : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.loginTime ? new Date(session.loginTime).toLocaleDateString('fr-FR') : ''}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {session.lastActivity ? new Date(session.lastActivity).toLocaleTimeString('fr-FR') : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.lastActivity ? new Date(session.lastActivity).toLocaleDateString('fr-FR') : ''}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {session.loginTime ? calculateDuration(session.loginTime) : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.isActive ? (
                              <span className="flex items-center text-green-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                En ligne
                              </span>
                            ) : (
                              <span className="text-yellow-600">Inactif</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {activeSessions.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-500">Aucune session active</p>
                  <p className="text-gray-400 text-sm mt-1">Les sessions apparaîtront ici lorsque les utilisateurs se connecteront</p>
                </div>
              )}
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {menuItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`bg-${item.color}-600 hover:bg-${item.color}-700 text-white py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center text-xs sm:text-sm lg:text-base`}
                  >
                    <span className="mr-1 sm:mr-2 text-sm sm:text-base">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Informations système */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Informations Super Administration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <div className="mb-3 sm:mb-4">
                    <p className="text-gray-600 text-sm">Utilisateurs dans la base</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {systemStats.totalUsers} utilisateurs
                    </p>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <p className="text-gray-600 text-sm">Hiérarchie des rôles</p>
                    <div className="space-y-1 sm:space-y-2 mt-1 sm:mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-600 font-medium text-sm sm:text-base">Super Admins</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs sm:text-sm">
                          {systemStats.superAdminCount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-600 font-medium text-sm sm:text-base">Admins</span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs sm:text-sm">
                          {systemStats.adminCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-3 sm:mb-4">
                    <p className="text-gray-600 text-sm">Statut Firestore</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connecté
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Super Admin
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <p className="text-gray-600 text-sm">Dernière mise à jour</p>
                    <p className="text-base sm:text-lg font-semibold">
                      {new Date().toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div>
            {/* En-tête avec boutons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Gestion Utilisateurs</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {filteredUsers.length} users
                </span>
                <button 
                  onClick={fetchRealData}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors flex items-center text-xs sm:text-sm"
                >
                  <RefreshIcon />
                  <span className="ml-1 sm:ml-2 hidden sm:inline">Actualiser</span>
                  <span className="ml-1 sm:hidden">🔄</span>
                </button>
                <button 
                  onClick={createMissingAdmins}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="mr-1 sm:mr-2">➕</span>
                  <span className="hidden sm:inline">Créer Admins</span>
                  <span className="sm:hidden">Admins</span>
                </button>
              </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Recherche</label>
                  <input
                    type="text"
                    placeholder="Nom, email..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select
                    value={filters.role}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Tous</option>
                    <option value="super-admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="member">Membre</option>
                    <option value="user">Utilisateur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Voix</label>
                  <select
                    value={filters.vocalRange}
                    onChange={(e) => handleFilterChange('vocalRange', e.target.value)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Toutes</option>
                    <option value="soprano">Soprano</option>
                    <option value="mezzo-soprano">Mezzo</option>
                    <option value="alto">Alto</option>
                    <option value="contralto">Contralto</option>
                    <option value="tenor">Ténor</option>
                    <option value="baritone">Baryton</option>
                    <option value="bass">Basse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Tous</option>
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
                      <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="hidden sm:inline">Email</span>
                        <span className="sm:hidden">@</span>
                      </th>
                      <SortableHeader 
                        label="Rôle" 
                        sortKey="role" 
                        currentSort={sortConfig} 
                      />
                      <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="hidden sm:inline">Voix</span>
                        <span className="sm:hidden">🎵</span>
                      </th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Mission
                      </th>
                      <SortableHeader 
                        label="Statut" 
                        sortKey="isActive" 
                        currentSort={sortConfig} 
                      />
                      <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="hidden sm:inline">Promotion</span>
                        <span className="sm:hidden">⬆️</span>
                      </th>
                      <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                              </div>
                              <div className="ml-2 sm:ml-4">
                                {editingUser === user.id ? (
                                  <input
                                    type="text"
                                    value={editFormData.displayName}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                    className="px-1 py-0.5 sm:px-2 sm:py-1 border border-gray-300 rounded text-xs sm:text-sm w-20 sm:w-32"
                                    placeholder="Nom"
                                  />
                                ) : (
                                  <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-none">
                                    {user.displayName || 'Non renseigné'}
                                    {isCurrentUser && <span className="ml-1 text-blue-600 text-xs">(Vous)</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap">
                            {editingUser === user.id ? (
                              <input
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="px-1 py-0.5 sm:px-2 sm:py-1 border border-gray-300 rounded text-xs sm:text-sm w-24 sm:w-40"
                                placeholder="Email"
                              />
                            ) : (
                              <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[100px] sm:max-w-none">{user.email}</div>
                            )}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap">
                            {editingUser === user.id ? (
                              <select
                                value={editFormData.role}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                                className="w-full px-1 py-0.5 sm:px-2 sm:py-1 border border-gray-300 rounded text-xs sm:text-sm"
                              >
                                <option value="user">User</option>
                                <option value="member">Membre</option>
                                <option value="admin">Admin</option>
                                <option value="super-admin">Super</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${
                                user.role === 'super-admin' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                user.role === 'member' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                <span className="hidden sm:inline">{user.role || 'user'}</span>
                                <span className="sm:hidden">{user.role?.substring(0, 1) || 'u'}</span>
                                {isSuperAdmin && ' 👑'}
                              </span>
                            )}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap">
                            {editingUser === user.id ? (
                              <select
                                value={editFormData.vocalRange || ''}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, vocalRange: e.target.value }))}
                                className="w-full px-1 py-0.5 sm:px-2 sm:py-1 border border-gray-300 rounded text-xs sm:text-sm"
                              >
                                <option value="">-</option>
                                <option value="soprano">Soprano</option>
                                <option value="mezzo-soprano">Mezzo</option>
                                <option value="alto">Alto</option>
                                <option value="contralto">Contralto</option>
                                <option value="tenor">Ténor</option>
                                <option value="baritone">Baryton</option>
                                <option value="bass">Basse</option>
                              </select>
                            ) : (
                              user.vocalRange ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <span className="hidden sm:inline">{user.vocalRange}</span>
                                  <span className="sm:hidden">{user.vocalRange.substring(0, 3)}</span>
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )
                            )}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 hidden sm:table-cell">
                            <div className="text-xs sm:text-sm text-gray-900 max-w-xs truncate" title={user.mission}>
                              {user.mission || '-'}
                            </div>
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${
                              user.isActive === false 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              <span className="hidden sm:inline">{user.isActive === false ? 'Inactif' : 'Actif'}</span>
                              <span className="sm:hidden">{user.isActive === false ? '❌' : '✅'}</span>
                            </span>
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap">
                            <QuickPromoteButton user={user} currentUserProfile={userProfile} />
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap">
                            {editingUser === user.id ? (
                              <div className="flex gap-1 sm:gap-2">
                                <button
                                  onClick={() => handleSaveEdit(user.id)}
                                  className="text-green-600 hover:text-green-800 transition-colors p-1 rounded hover:bg-green-50 text-sm"
                                  title="Sauvegarder"
                                >
                                  💾
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50 text-sm"
                                  title="Annuler"
                                >
                                  ❌
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-1 sm:gap-2">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50 text-sm"
                                  title="Modifier"
                                >
                                  ✏️
                                </button>
                                {!isCurrentUser && (
                                  <button
                                    onClick={() => setDeleteConfirm(user.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50 text-sm"
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
                <div className="bg-white px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-700">
                        <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span>-<span className="font-medium">{Math.min(pagination.currentPage * pagination.itemsPerPage, filteredUsers.length)}</span> sur <span className="font-medium">{filteredUsers.length}</span>
                      </p>
                    </div>
                    <div className="flex gap-1 sm:gap-2 items-center">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                        disabled={pagination.currentPage === 1}
                        className="relative inline-flex items-center px-2 sm:px-3 py-1 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ←
                      </button>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                              className={`relative inline-flex items-center px-2 sm:px-3 py-1 border text-xs sm:text-sm font-medium rounded-md ${
                                page === pagination.currentPage
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="relative inline-flex items-center px-2 sm:px-3 py-1 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {filteredUsers.length === 0 && (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-gray-500 text-sm sm:text-base">Aucun utilisateur trouvé</p>
                  <button 
                    onClick={createMissingAdmins}
                    className="mt-3 sm:mt-4 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Créer les comptes admin
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      // SECTIONS AVEC LES DASHBOARDS IMPORTÉS
      case 'events':
        return <EventsDashboard />;

      case 'content':
        return <ContentDashboard />;

      case 'repertoire':
        return <RepertoireDashboard />;

      case 'stats':
        return <StatisticsDashboard />;

      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Section en développement</h3>
            <p className="text-gray-600">Cette fonctionnalité sera disponible prochainement.</p>
          </div>
        );
    }
  };

  // 🔐 Vérification des permissions
  if (!userProfile || userProfile.role !== 'super-admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-4">Accès réservé aux Super Administrateurs.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* EN-TÊTE SUPER ADMIN */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate max-w-[150px] sm:max-w-none">Super Admin C.A.S.T.</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs sm:text-sm text-gray-600">Connecté</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                  {userProfile?.displayName || 'Super Admin'}
                </p>
              </div>
              
              {/* Badge Super Admin */}
              <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-purple-500 to-yellow-500 px-2 sm:px-3 py-1 rounded-lg">
                <span className="text-white text-sm">👑</span>
                <span className="text-white text-xs sm:text-sm font-medium uppercase hidden sm:inline">
                  SUPER ADMIN
                </span>
                <span className="text-white text-xs font-medium uppercase sm:hidden">
                  SUPER
                </span>
              </div>

              {/* Bouton Déconnexion */}
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors flex items-center text-xs sm:text-sm"
              >
                <span className="mr-1 sm:mr-2">🚪</span>
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Navigation mobile améliorée */}
        <div className="mb-4 sm:mb-6">
          {/* Menu mobile - Bouton hamburger */}
          <div className="sm:hidden mb-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full bg-white border border-gray-300 rounded-lg p-3 flex items-center justify-between"
            >
              <span className="font-medium text-gray-700">
                {menuItems.find(item => item.id === activeSection)?.name || 'Navigation'}
              </span>
              <span className={`transform transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>

          {/* Menu déroulant mobile */}
          {mobileMenuOpen && (
            <div className="sm:hidden bg-white border border-gray-200 rounded-lg shadow-lg mb-3">
              <div className="p-2 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center ${
                      activeSection === item.id
                        ? `bg-${item.color}-100 text-${item.color}-700`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2 text-base">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Navigation desktop */}
          <div className="hidden sm:block">
            <div className="flex space-x-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center px-3 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                    activeSection === item.id
                      ? `bg-${item.color}-100 text-${item.color}-700`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2 text-base">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages d'alerte */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-2 sm:mr-3">❌</div>
              <p className="text-red-800 text-sm flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <div className="text-green-600 mr-2 sm:mr-3">✅</div>
              <p className="text-green-800 text-sm flex-1">{success}</p>
              <button
                onClick={() => setSuccess(null)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Confirmation de suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm sm:text-base"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <main>
          {loading && activeSection === 'overview' ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;