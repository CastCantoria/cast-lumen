import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useAuthorization } from '../../../hooks/useAuthorization';
import PermissionGuard from '../../../components/auth/PermissionGuard';
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import { ROLES, PERMISSIONS } from '../../../config/roles';
import { Link } from 'react-router-dom';

// Import des composants admin
import UserManagement from '../../../components/admin/UserManagement';
import AdmissionManagement from '../../../components/admin/AdmissionManagement';
import EventCreation from '../../../components/admin/EventCreation';
import EventCalendar from '../../../components/admin/EventCalendar';
import PartitionManager from '../../../components/admin/PartitionManager';
import GalleryManager from '../../../components/admin/GalleryManager';
import ArticlePublisher from '../../../components/admin/ArticlePublisher';
import MemberInviter from '../../../components/admin/MemberInviter';

// Fonction utilitaire pour obtenir le nom d'affichage sécurisé
const getSafeDisplayName = (user) => {
  const displayName = user.displayName;
  
  if (typeof displayName === 'string') {
    return displayName;
  }
  
  if (displayName && typeof displayName === 'object') {
    // Si c'est un objet Firestore, essayez de le convertir en string
    return String(displayName);
  }
  
  // Si displayName n'existe pas ou est invalide
  if (user.email) {
    return user.email.split('@')[0]; // Utilise la partie avant @ de l'email
  }
  
  return 'Utilisateur';
};

// Fonction utilitaire pour obtenir l'initiale du nom
const getInitial = (user) => {
  const displayName = getSafeDisplayName(user);
  return displayName.charAt(0).toUpperCase();
};

const SuperAdminDashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { can, currentRole } = useAuthorization();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalCoreTeam: 0,
    totalMembers: 0,
    totalEvents: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeComponent, setActiveComponent] = useState('dashboard');

  useEffect(() => {
    if (currentUser && userProfile?.role === "super-admin") {
      loadDashboardData();
    }
  }, [currentUser, userProfile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Récupérer tous les utilisateurs
      const usersSnapshot = await getDocs(collection(db, "users"));
      
      // Récupérer uniquement les membres (choristes)
      const membersQuery = query(collection(db, "users"), where("role", "==", "member"));
      const membersSnapshot = await getDocs(membersQuery);
      
      // Récupérer la core team
      const coreTeamQuery = query(collection(db, "users"), where("role", "==", "core-team"));
      const coreTeamSnapshot = await getDocs(coreTeamQuery);
      
      const eventsSnapshot = await getDocs(collection(db, "events"));

      const usersData = usersSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Normaliser les données pour s'assurer que displayName est une string
        displayName: getSafeDisplayName(doc.data())
      }));
      
      setUsers(usersData);
      
      // Les admins sont seulement ceux avec le rôle 'admin' (les super-admin ne comptent pas dans les stats admin)
      const admins = usersData.filter(user => user.role === "admin");
      
      // Utilisateurs actifs (tous rôles confondus)
      const activeUsers = usersData.filter(user => user.isActive !== false);

      setStats({
        totalUsers: usersData.length,
        totalAdmins: admins.length,
        totalCoreTeam: coreTeamSnapshot.size,
        totalMembers: membersSnapshot.size,
        totalEvents: eventsSnapshot.size,
        activeUsers: activeUsers.length
      });

      // Activité récente (tous les utilisateurs)
      const recentUsers = usersData
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

      setRecentActivity(recentUsers);

    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action, userData) => {
    try {
      const userRef = doc(db, "users", userId);
      
      switch (action) {
        case "activate":
          await updateDoc(userRef, { 
            isActive: true,
            updatedAt: new Date()
          });
          break;
        case "deactivate":
          await updateDoc(userRef, { 
            isActive: false,
            updatedAt: new Date()
          });
          break;
        case "promote_to_member":
          await updateDoc(userRef, { 
            role: "member",
            updatedAt: new Date()
          });
          break;
        case "promote_to_admin":
          if (userData.role === 'member') {
            await updateDoc(userRef, { 
              role: "admin",
              permissions: ["read_events", "read_members", "read_repertoire", "manage_events", "manage_members", "manage_content"],
              updatedAt: new Date()
            });
          } else {
            alert("❌ Seuls les membres peuvent être promus administrateurs");
            return;
          }
          break;
        case "demote_to_member":
          await updateDoc(userRef, { 
            role: "member",
            permissions: [],
            updatedAt: new Date()
          });
          break;
        case "demote_to_user":
          await updateDoc(userRef, { 
            role: "user",
            permissions: [],
            updatedAt: new Date()
          });
          break;
        default:
          break;
      }

      await loadDashboardData();
    } catch (error) {
      console.error("Erreur action utilisateur:", error);
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

        {/* Navigation par onglets */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 py-4">
              {[
                { id: "overview", label: "📊 Aperçu", icon: "📊" },
                { id: "users", label: "👥 Utilisateurs", icon: "👥" },
                { id: "admins", label: "🛡️ Administrateurs", icon: "🛡️" },
                { id: "system", label: "⚙️ Système", icon: "⚙️" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Contenu des onglets */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Statistiques avec liens fonctionnels */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer">
                  <div className="text-3xl font-bold text-purple-600">{stats.totalUsers}</div>
                  <div className="text-gray-600">Utilisateurs Total</div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalAdmins}</div>
                  <div className="text-gray-600">Administrateurs</div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer">
                  <div className="text-3xl font-bold text-pink-600">{stats.totalCoreTeam}</div>
                  <div className="text-gray-600">Core Team</div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer">
                  <div className="text-3xl font-bold text-green-600">{stats.totalMembers}</div>
                  <div className="text-gray-600">Membres Actifs</div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer">
                  <div className="text-3xl font-bold text-orange-600">{stats.totalEvents}</div>
                  <div className="text-gray-600">Événements</div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer">
                  <div className="text-3xl font-bold text-teal-600">{stats.activeUsers}</div>
                  <div className="text-gray-600">Utilisateurs Actifs</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section Gestion des Membres */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">👥 Gestion des Membres</h2>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab("users")}
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
                      to="/dashboard/super-admin/messages"
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
                      to="/dashboard/super-admin/statistics"
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

              {/* Activité Récente - SECTION CORRIGÉE */}
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">📈 Activité Récente</h2>
                <div className="space-y-3">
                  {recentActivity.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => navigate(`/dashboard/super-admin/users/${user.id}`)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                          {getInitial(user)}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {getSafeDisplayName(user)}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {user.role || 'non défini'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          {user.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email || 'Email non disponible'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <UsersManagement users={users} loading={loading} onUserAction={handleUserAction} />
          )}

          {activeTab === "admins" && (
            <AdminsManagement users={users} loading={loading} />
          )}

          {activeTab === "system" && (
            <SystemSettings />
          )}
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

// Composant de gestion des utilisateurs - CORRIGÉ
const UsersManagement = ({ users, loading, onUserAction }) => {
  if (loading) return <div className="text-center py-8">Chargement des utilisateurs...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Gestion des Utilisateurs</h2>
      
      {/* Légende des rôles */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">📋 Hiérarchie des Rôles</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            <span><strong>Super-Admin</strong> : Accès complet</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span><strong>Admin</strong> : Doit être membre</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span><strong>Membre</strong> : Choriste validé</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
            <span><strong>User</strong> : Utilisateur standard</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {getSafeDisplayName(user)}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">
                      Inscrit le: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'super-admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'admin' ? 'bg-green-100 text-green-800' :
                    user.role === 'member' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive !== false ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col space-y-1">
                    {user.role !== 'super-admin' && (
                      <div className="flex space-x-2">
                        {user.role === 'user' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'promote_to_member', user)}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            👥 Devenir Membre
                          </button>
                        )}
                        {user.role === 'member' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'promote_to_admin', user)}
                            className="text-green-600 hover:text-green-900 text-xs"
                          >
                            🛡️ Promouvoir Admin
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'demote_to_member', user)}
                            className="text-orange-600 hover:text-orange-900 text-xs"
                          >
                            👥 Rétrograder Membre
                          </button>
                        )}
                        {(user.role === 'member' || user.role === 'admin') && user.role !== 'super-admin' && (
                          <button 
                            onClick={() => onUserAction(
                              user.id, 
                              user.role === 'admin' ? 'demote_to_user' : 'demote_to_user', 
                              user
                            )}
                            className="text-gray-600 hover:text-gray-900 text-xs"
                          >
                            👤 Rétrograder User
                          </button>
                        )}
                        {user.isActive !== false ? (
                          <button 
                            onClick={() => onUserAction(user.id, 'deactivate', user)}
                            className="text-red-600 hover:text-red-900 text-xs"
                          >
                            ❌ Désactiver
                          </button>
                        ) : (
                          <button 
                            onClick={() => onUserAction(user.id, 'activate', user)}
                            className="text-green-600 hover:text-green-900 text-xs"
                          >
                            ✅ Activer
                          </button>
                        )}
                      </div>
                    )}
                    {user.role === 'super-admin' && (
                      <span className="text-xs text-gray-500">Super-Admin (accès complet)</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant de gestion des administrateurs - CORRIGÉ
const AdminsManagement = ({ users, loading }) => {
  if (loading) return <div className="text-center py-8">Chargement des administrateurs...</div>;

  const admins = users.filter(user => user.role === 'admin' || user.role === 'super-admin');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🛡️ Gestion des Administrateurs</h2>
      
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-medium text-green-900">Règles de promotion administrative</h3>
        <p className="text-sm text-green-700 mt-1">
          <strong>Hiérarchie :</strong> User → Membre (choriste) → Admin<br/>
          <strong>Super-Admin :</strong> Accès complet • <strong>Admin :</strong> Gestion limitée<br/>
          <strong>Règle :</strong> Seuls les membres peuvent devenir administrateurs
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière activité</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {getSafeDisplayName(admin)}
                    </div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                    <div className="text-xs text-gray-400">
                      {admin.role === 'admin' ? 'Ancien membre promu' : 'Créateur système'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    admin.role === 'super-admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {admin.role === 'super-admin' 
                    ? 'Toutes les permissions' 
                    : (admin.permissions?.join(', ') || 'Permissions de base admin')
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.updatedAt ? new Date(admin.updatedAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant des paramètres système
const SystemSettings = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Paramètres Système</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">🔧 Maintenance</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50">Vider le cache</button>
              <button className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50">Regénérer les index</button>
              <button className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50">Sauvegarde de la base</button>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">📊 Analytics</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50">Voir les statistiques</button>
              <button className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50">Rapports d'usage</button>
              <button className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50">Logs système</button>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-medium text-yellow-800 mb-2">⚠️ Zone de configuration avancée</h3>
          <p className="text-sm text-yellow-700">
            Ces paramètres affectent le fonctionnement global de la plateforme. Utilisez avec précaution.
          </p>
        </div>
      </div>
    </div>
  );
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