import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAuthorization } from '../../../hooks/useAuthorization';
import PermissionGuard from '../../../components/auth/PermissionGuard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { ROLES, PERMISSIONS } from '../../../config/roles';
import { Link, useNavigate } from 'react-router-dom';

// Import des nouveaux composants
import UserManagement from '../../../components/admin/UserManagement';
import AdmissionManagement from '../../../components/admin/AdmissionManagement';
import EventCreation from '../../../components/admin/EventCreation';
import EventCalendar from '../../../components/admin/EventCalendar';
import PartitionManager from '../../../components/admin/PartitionManager';
import GalleryManager from '../../../components/admin/GalleryManager';
import ArticlePublisher from '../../../components/admin/ArticlePublisher';
import MemberInviter from '../../../components/admin/MemberInviter';

const SuperAdminDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const { can, currentRole } = useAuthorization();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalCoreTeam: 0,
    totalMembers: 0,
    totalEvents: 0,
    activeUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState('dashboard'); // État pour gérer l'affichage

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const admins = users.filter(user => user.role === 'admin');
      const coreTeam = users.filter(user => user.role === 'core-team');
      const members = users.filter(user => user.role === 'membre');
      const activeUsers = users.filter(user => user.isActive);

      setStats({
        totalUsers: users.length,
        totalAdmins: admins.length,
        totalCoreTeam: coreTeam.length,
        totalMembers: members.length,
        totalEvents: 0,
        activeUsers: activeUsers.length
      });

      const recentUsers = users
        .sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0))
        .slice(0, 5);
      
      setRecentActivity(recentUsers);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour revenir au dashboard principal
  const handleBackToDashboard = () => {
    setActiveComponent('dashboard');
  };

  // Navigation vers l'accueil du site
  const handleGoToHome = () => {
    navigate('/');
  };

  // Rendu conditionnel basé sur le composant actif
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'UserManagement':
        return <UserManagement />;
      case 'AdmissionManagement':
        return <AdmissionManagement />;
      case 'EventCreation':
        return <EventCreation />;
      case 'EventCalendar':
        return <EventCalendar />;
      case 'PartitionManager':
        return <PartitionManager />;
      case 'GalleryManager':
        return <GalleryManager />;
      case 'ArticlePublisher':
        return <ArticlePublisher />;
      case 'MemberInviter':
        return <MemberInviter />;
      default:
        return renderMainDashboard();
    }
  };

  const renderMainDashboard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Header avec informations de rôle */}
        <div className="bg-black bg-opacity-50 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Tableau de Bord Super-Admin</h1>
                <p className="text-purple-200">
                  Gestion complète de la plateforme C.A.S.T. • Rôle: <strong>{currentRole}</strong>
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Bouton pour retourner à l'accueil du site */}
                <button
                  onClick={handleGoToHome}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  🏠 Accueil du Site
                </button>
                <div className="bg-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                  👑 Super-Admin
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Statistiques avec liens fonctionnels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Link 
              to="/admin/users" 
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer block"
            >
              <div className="text-3xl font-bold text-purple-600">{stats.totalUsers}</div>
              <div className="text-gray-600">Utilisateurs Total</div>
            </Link>
            <Link 
              to="/admin/users?role=admin" 
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer block"
            >
              <div className="text-3xl font-bold text-blue-600">{stats.totalAdmins}</div>
              <div className="text-gray-600">Administrateurs</div>
            </Link>
            <Link 
              to="/admin/users?role=core-team" 
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer block"
            >
              <div className="text-3xl font-bold text-pink-600">{stats.totalCoreTeam}</div>
              <div className="text-gray-600">Core Team</div>
            </Link>
            <Link 
              to="/admin/users?role=membre" 
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer block"
            >
              <div className="text-3xl font-bold text-green-600">{stats.totalMembers}</div>
              <div className="text-gray-600">Membres Actifs</div>
            </Link>
            <Link 
              to="/admin/events" 
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer block"
            >
              <div className="text-3xl font-bold text-orange-600">{stats.totalEvents}</div>
              <div className="text-gray-600">Événements</div>
            </Link>
            <Link 
              to="/admin/analytics" 
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer block"
            >
              <div className="text-3xl font-bold text-teal-600">{stats.activeUsers}</div>
              <div className="text-gray-600">Utilisateurs Actifs</div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section Gestion des Membres */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">👥 Gestion des Membres</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveComponent('UserManagement')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  👥 Voir tous les Membres
                </button>
                <button 
                  onClick={() => setActiveComponent('AdmissionManagement')}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  ✅ Gérer les Admissions
                </button>
                <Link 
                  to="/admin/messages"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 block text-center"
                >
                  💬 Envoyer un Message
                </Link>
              </div>
            </div>

            {/* Section Gestion des Événements */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">🎭 Gestion des Événements</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveComponent('EventCreation')}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
                >
                  🎵 Créer un Événement
                </button>
                <button 
                  onClick={() => setActiveComponent('EventCalendar')}
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
                >
                  📅 Calendrier des Concerts
                </button>
                <Link 
                  to="/admin/statistics"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 block text-center"
                >
                  📊 Statistiques de Participation
                </Link>
              </div>
            </div>
          </div>

          {/* Section Actions Rapides */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">⚡ Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => setActiveComponent('PartitionManager')}
                className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                📝 Ajouter une Partition
              </button>
              <button 
                onClick={() => setActiveComponent('GalleryManager')}
                className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                🖼️ Gérer la Galerie
              </button>
              <button 
                onClick={() => setActiveComponent('ArticlePublisher')}
                className="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
              >
                📰 Publier un Article
              </button>
              <button 
                onClick={() => setActiveComponent('MemberInviter')}
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                👥 Inviter un Membre
              </button>
            </div>
          </div>

          {/* Section Gestion des Rôles */}
          <PermissionGuard permission={PERMISSIONS.MANAGE_ALL_ACCOUNTS}>
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">🎭 Gestion des Rôles</h2>
              <div className="space-y-3">
                <Link 
                  to="/admin/roles/super-admins"
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition flex items-center justify-between block"
                >
                  <span>👑 Gérer les Super-Admins</span>
                  <span className="text-xs bg-purple-800 px-2 py-1 rounded">Permission requise</span>
                </Link>
                <Link 
                  to="/admin/roles/admins"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition block text-center"
                >
                  ⚙️ Gérer les Admins
                </Link>
                <Link 
                  to="/admin/roles/core-team"
                  className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition block text-center"
                >
                  🎵 Gérer la Core Team
                </Link>
              </div>
            </div>
          </PermissionGuard>

          {/* Activité Récente */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">📈 Activité Récente</h2>
            <div className="space-y-3">
              {recentActivity.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => navigate(`/admin/users/${user.id}`)}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{user.displayName || 'Utilisateur'}</div>
                      <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      {user.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link 
                to="/admin/activity-logs"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Voir tous les logs d'activité →
              </Link>
            </div>
          </div>

          {/* Section Sécurité */}
          <PermissionGuard permission={PERMISSIONS.SECURITY_CRITICAL}>
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
              <h2 className="text-xl font-bold mb-4 text-gray-800">🛡️ Sécurité Critique</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  to="/admin/maintenance"
                  className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition text-center block"
                >
                  🔧 Maintenance Système
                </Link>
                <Link 
                  to="/admin/security-logs"
                  className="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition text-center block"
                >
                  📋 Logs d'Activité
                </Link>
                <Link 
                  to="/admin/advanced-settings"
                  className="bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition text-center block"
                >
                  ⚙️ Paramètres Avancés
                </Link>
              </div>
            </div>
          </PermissionGuard>

          {/* Section Rapports */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">📊 Rapports et Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                to="/admin/reports/users"
                className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition text-center block"
              >
                <div className="text-lg font-semibold">📈 Rapport Utilisateurs</div>
              </Link>
              <Link 
                to="/admin/reports/events"
                className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition text-center block"
              >
                <div className="text-lg font-semibold">🎭 Rapport Événements</div>
              </Link>
              <Link 
                to="/admin/reports/financial"
                className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition text-center block"
              >
                <div className="text-lg font-semibold">💰 Rapport Financier</div>
              </Link>
              <Link 
                to="/admin/reports/performance"
                className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition text-center block"
              >
                <div className="text-lg font-semibold">⚡ Performance</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Si un composant spécifique est actif, afficher la barre de navigation
  if (activeComponent !== 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Barre de navigation pour les sous-pages */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToDashboard}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                  ← Retour au Dashboard
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getComponentTitle(activeComponent)}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleGoToHome}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  🏠 Accueil du Site
                </button>
                <div className="bg-purple-600 px-3 py-1 rounded-full text-sm font-medium text-white">
                  👑 Super-Admin
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu du composant actif */}
        <div className="max-w-7xl mx-auto py-6">
          {renderActiveComponent()}
        </div>
      </div>
    );
  }

  // Sinon, afficher le dashboard principal
  return renderMainDashboard();
};

// Helper pour obtenir le titre du composant
const getComponentTitle = (component) => {
  const titles = {
    'UserManagement': 'Gestion des Membres',
    'AdmissionManagement': 'Gestion des Admissions',
    'EventCreation': 'Création d\'Événement',
    'EventCalendar': 'Calendrier des Événements',
    'PartitionManager': 'Gestion des Partitions',
    'GalleryManager': 'Gestion de la Galerie',
    'ArticlePublisher': 'Publication d\'Article',
    'MemberInviter': 'Invitation de Membres'
  };
  return titles[component] || 'Tableau de Bord';
};

export default SuperAdminDashboard;