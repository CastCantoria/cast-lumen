import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useAuthorization } from '../../../hooks/useAuthorization';
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useNavigate, Link } from "react-router-dom";

// Fonction utilitaire pour obtenir le nom d'affichage sécurisé
const getSafeDisplayName = (user) => {
  const displayName = user.displayName;
  
  if (typeof displayName === 'string') {
    return displayName;
  }
  
  if (displayName && typeof displayName === 'object') {
    return String(displayName);
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'Utilisateur';
};

// Fonction utilitaire pour obtenir l'initiale du nom
const getInitial = (user) => {
  const displayName = getSafeDisplayName(user);
  return displayName.charAt(0).toUpperCase();
};

const SuperAdminDashboard = () => {
  const { currentUser, userProfile } = useAuth();
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
      
      // Récupérer les membres
      const membersQuery = query(collection(db, "users"), where("role", "==", "member"));
      const membersSnapshot = await getDocs(membersQuery);
      
      // Récupérer la core team
      const coreTeamQuery = query(collection(db, "users"), where("role", "==", "core-team"));
      const coreTeamSnapshot = await getDocs(coreTeamQuery);
      
      const eventsSnapshot = await getDocs(collection(db, "events"));

      const usersData = usersSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        displayName: getSafeDisplayName(doc.data())
      }));
      
      setUsers(usersData);
      
      // Les admins sont seulement ceux avec le rôle 'admin'
      const admins = usersData.filter(user => user.role === "admin");
      
      // Utilisateurs actifs
      const activeUsers = usersData.filter(user => user.isActive !== false);

      setStats({
        totalUsers: usersData.length,
        totalAdmins: admins.length,
        totalCoreTeam: coreTeamSnapshot.size,
        totalMembers: membersSnapshot.size,
        totalEvents: eventsSnapshot.size,
        activeUsers: activeUsers.length
      });

      // Activité récente
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

  // Navigation vers l'accueil du site
  const handleGoToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement du tableau de bord Super-Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header avec informations de rôle */}
      <div className="bg-black bg-opacity-50 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Tableau de Bord Super-Admin
              </h1>
              <p className="text-purple-200 text-lg">
                Gestion complète de la plateforme C.A.S.T. • Rôle: <strong>{currentRole}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoToHome}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                🏠 Accueil du Site
              </button>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                👑 Super-Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex flex-wrap gap-4 py-6">
            {[
              { id: "overview", label: "📊 Aperçu", icon: "📊" },
              { id: "users", label: "👥 Utilisateurs", icon: "👥" },
              { id: "admins", label: "🛡️ Administrateurs", icon: "🛡️" },
              { id: "system", label: "⚙️ Système", icon: "⚙️" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-purple-600 shadow-lg transform -translate-y-1"
                    : "text-white hover:bg-white hover:bg-opacity-20 hover:text-white"
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
            {/* Statistiques */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              {[
                { value: stats.totalUsers, label: "Utilisateurs Total", color: "purple", icon: "👥" },
                { value: stats.totalAdmins, label: "Administrateurs", color: "blue", icon: "🛡️" },
                { value: stats.totalCoreTeam, label: "Core Team", color: "pink", icon: "🌟" },
                { value: stats.totalMembers, label: "Membres Actifs", color: "green", icon: "🎵" },
                { value: stats.totalEvents, label: "Événements", color: "orange", icon: "🎭" },
                { value: stats.activeUsers, label: "Utilisateurs Actifs", color: "teal", icon: "✅" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300 border border-gray-200"
                >
                  <div className={`text-3xl mb-3 text-${stat.color}-500`}>
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-semibold text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Section Gestion des Membres */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <span className="text-blue-500">👥</span>
                  Gestion des Membres
                </h2>
                <div className="space-y-4">
                  {[
                    { action: () => setActiveTab("users"), label: "Voir tous les Membres", icon: "👥", color: "blue" },
                    { to: "/admin/admissions", label: "Gérer les Admissions", icon: "✅", color: "green" },
                    { to: "/admin/messages", label: "Envoyer un Message", icon: "💬", color: "indigo" }
                  ].map((item, index) => (
                    item.action ? (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`w-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white py-4 px-6 rounded-xl hover:from-${item.color}-600 hover:to-${item.color}-700 transition-all duration-300 flex items-center gap-4 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={index}
                        to={item.to}
                        className={`w-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white py-4 px-6 rounded-xl hover:from-${item.color}-600 hover:to-${item.color}-700 transition-all duration-300 flex items-center gap-4 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 block text-center`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    )
                  ))}
                </div>
              </div>

              {/* Section Gestion des Événements */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <span className="text-orange-500">🎭</span>
                  Gestion des Événements
                </h2>
                <div className="space-y-4">
                  {[
                    { to: "/admin/events/create", label: "Créer un Événement", icon: "🎵", color: "orange" },
                    { to: "/admin/calendar", label: "Calendrier des Concerts", icon: "📅", color: "teal" },
                    { to: "/admin/statistics", label: "Statistiques de Participation", icon: "📊", color: "indigo" }
                  ].map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className={`w-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white py-4 px-6 rounded-xl hover:from-${item.color}-600 hover:to-${item.color}-700 transition-all duration-300 flex items-center gap-4 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 block text-center`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Actions Rapides */}
            <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <span className="text-purple-500">⚡</span>
                Actions Rapides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { to: "/admin/partitions/add", label: "Ajouter une Partition", icon: "📝", color: "gray" },
                  { to: "/admin/gallery", label: "Gérer la Galerie", icon: "🖼️", color: "red" },
                  { to: "/admin/articles/create", label: "Publier un Article", icon: "📰", color: "yellow" },
                  { to: "/admin/invite", label: "Inviter un Membre", icon: "👥", color: "green" }
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    className={`bg-${item.color}-500 hover:bg-${item.color}-600 text-white py-4 px-4 rounded-xl transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex flex-col items-center gap-2`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Activité Récente */}
            <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <span className="text-blue-500">📈</span>
                Activité Récente
              </h2>
              <div className="space-y-4">
                {recentActivity.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {getInitial(user)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                          {getSafeDisplayName(user)}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {user.role || 'non défini'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 font-medium">
                        {user.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                      </div>
                      <div className="text-xs text-gray-400">
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

// Composant de gestion des utilisateurs
const UsersManagement = ({ users, loading, onUserAction }) => {
  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement des utilisateurs...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <span className="text-blue-500">👥</span>
        Gestion des Utilisateurs
      </h2>
      
      {/* Légende des rôles */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-900 text-lg mb-4 flex items-center gap-2">
          <span>📋</span>
          Hiérarchie des Rôles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
            <div>
              <div className="font-semibold text-purple-700">Super-Admin</div>
              <div className="text-purple-600 text-xs">Accès complet</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
            <div>
              <div className="font-semibold text-green-700">Admin</div>
              <div className="text-green-600 text-xs">Doit être membre</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
            <div>
              <div className="font-semibold text-blue-700">Membre</div>
              <div className="text-blue-600 text-xs">Choriste validé</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-gray-400 rounded-full"></span>
            <div>
              <div className="font-semibold text-gray-700">User</div>
              <div className="text-gray-600 text-xs">Utilisateur standard</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitial(user)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {getSafeDisplayName(user)}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">
                        Inscrit le: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'super-admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                    user.role === 'admin' ? 'bg-green-100 text-green-800 border border-green-200' :
                    user.role === 'member' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isActive !== false ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {user.isActive !== false ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col space-y-2">
                    {user.role !== 'super-admin' && (
                      <div className="flex flex-wrap gap-2">
                        {user.role === 'user' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'promote_to_member', user)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            👥 Devenir Membre
                          </button>
                        )}
                        {user.role === 'member' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'promote_to_admin', user)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            🛡️ Promouvoir Admin
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'demote_to_member', user)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
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
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            👤 Rétrograder User
                          </button>
                        )}
                        {user.isActive !== false ? (
                          <button 
                            onClick={() => onUserAction(user.id, 'deactivate', user)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            ❌ Désactiver
                          </button>
                        ) : (
                          <button 
                            onClick={() => onUserAction(user.id, 'activate', user)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            ✅ Activer
                          </button>
                        )}
                      </div>
                    )}
                    {user.role === 'super-admin' && (
                      <span className="text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                        Super-Admin (accès complet)
                      </span>
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

// Composant de gestion des administrateurs
const AdminsManagement = ({ users, loading }) => {
  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement des administrateurs...</p>
    </div>
  );

  const admins = users.filter(user => user.role === 'admin' || user.role === 'super-admin');

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <span className="text-green-500">🛡️</span>
        Gestion des Administrateurs
      </h2>
      
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <h3 className="font-semibold text-green-900 text-lg mb-3 flex items-center gap-2">
          <span>📋</span>
          Règles de promotion administrative
        </h3>
        <div className="text-green-800 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Hiérarchie :</span>
            <span>User → Membre (choriste) → Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Super-Admin :</span>
            <span>Accès complet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Admin :</span>
            <span>Gestion limitée</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Règle :</span>
            <span>Seuls les membres peuvent devenir administrateurs</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-green-50 to-emerald-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Administrateur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Permissions</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dernière activité</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map(admin => (
              <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitial(admin)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {getSafeDisplayName(admin)}
                      </div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                      <div className="text-xs text-gray-400">
                        {admin.role === 'admin' ? 'Ancien membre promu' : 'Créateur système'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    admin.role === 'super-admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {admin.role === 'super-admin' 
                    ? 'Toutes les permissions' 
                    : (admin.permissions?.join(', ') || 'Permissions de base admin')
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.updatedAt ? new Date(admin.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}
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
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <span className="text-gray-500">⚙️</span>
        Paramètres Système
      </h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-xl mb-6 flex items-center gap-3">
              <span className="text-blue-500">🔧</span>
              Maintenance
            </h3>
            <div className="space-y-4">
              {['Vider le cache', 'Regénérer les index', 'Sauvegarde de la base'].map((action, index) => (
                <button 
                  key={index}
                  className="w-full text-left p-4 bg-white rounded-xl border border-gray-300 hover:border-blue-500 hover:shadow-md transition-all duration-300 font-medium text-gray-700 hover:text-blue-600"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-green-50 p-8 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-xl mb-6 flex items-center gap-3">
              <span className="text-green-500">📊</span>
              Analytics
            </h3>
            <div className="space-y-4">
              {['Voir les statistiques', 'Rapports d\'usage', 'Logs système'].map((action, index) => (
                <button 
                  key={index}
                  className="w-full text-left p-4 bg-white rounded-xl border border-gray-300 hover:border-green-500 hover:shadow-md transition-all duration-300 font-medium text-gray-700 hover:text-green-600"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8">
          <h3 className="font-semibold text-yellow-800 text-xl mb-4 flex items-center gap-3">
            <span>⚠️</span>
            Zone de configuration avancée
          </h3>
          <p className="text-yellow-700 leading-relaxed">
            Ces paramètres affectent le fonctionnement global de la plateforme. 
            Utilisez avec précaution et uniquement si vous comprenez parfaitement les conséquences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useAuthorization } from '../../../hooks/useAuthorization';
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useNavigate, Link } from "react-router-dom";

// Fonction utilitaire pour obtenir le nom d'affichage sécurisé
const getSafeDisplayName = (user) => {
  const displayName = user.displayName;
  
  if (typeof displayName === 'string') {
    return displayName;
  }
  
  if (displayName && typeof displayName === 'object') {
    return String(displayName);
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'Utilisateur';
};

// Fonction utilitaire pour obtenir l'initiale du nom
const getInitial = (user) => {
  const displayName = getSafeDisplayName(user);
  return displayName.charAt(0).toUpperCase();
};

const SuperAdminDashboard = () => {
  const { currentUser, userProfile } = useAuth();
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
      
      // Récupérer les membres
      const membersQuery = query(collection(db, "users"), where("role", "==", "member"));
      const membersSnapshot = await getDocs(membersQuery);
      
      // Récupérer la core team
      const coreTeamQuery = query(collection(db, "users"), where("role", "==", "core-team"));
      const coreTeamSnapshot = await getDocs(coreTeamQuery);
      
      const eventsSnapshot = await getDocs(collection(db, "events"));

      const usersData = usersSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        displayName: getSafeDisplayName(doc.data())
      }));
      
      setUsers(usersData);
      
      // Les admins sont seulement ceux avec le rôle 'admin'
      const admins = usersData.filter(user => user.role === "admin");
      
      // Utilisateurs actifs
      const activeUsers = usersData.filter(user => user.isActive !== false);

      setStats({
        totalUsers: usersData.length,
        totalAdmins: admins.length,
        totalCoreTeam: coreTeamSnapshot.size,
        totalMembers: membersSnapshot.size,
        totalEvents: eventsSnapshot.size,
        activeUsers: activeUsers.length
      });

      // Activité récente
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

  // Navigation vers l'accueil du site
  const handleGoToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement du tableau de bord Super-Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header avec informations de rôle */}
      <div className="bg-black bg-opacity-50 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Tableau de Bord Super-Admin
              </h1>
              <p className="text-purple-200 text-lg">
                Gestion complète de la plateforme C.A.S.T. • Rôle: <strong>{currentRole}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoToHome}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                🏠 Accueil du Site
              </button>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                👑 Super-Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex flex-wrap gap-4 py-6">
            {[
              { id: "overview", label: "📊 Aperçu", icon: "📊" },
              { id: "users", label: "👥 Utilisateurs", icon: "👥" },
              { id: "admins", label: "🛡️ Administrateurs", icon: "🛡️" },
              { id: "system", label: "⚙️ Système", icon: "⚙️" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-purple-600 shadow-lg transform -translate-y-1"
                    : "text-white hover:bg-white hover:bg-opacity-20 hover:text-white"
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
            {/* Statistiques */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              {[
                { value: stats.totalUsers, label: "Utilisateurs Total", color: "purple", icon: "👥" },
                { value: stats.totalAdmins, label: "Administrateurs", color: "blue", icon: "🛡️" },
                { value: stats.totalCoreTeam, label: "Core Team", color: "pink", icon: "🌟" },
                { value: stats.totalMembers, label: "Membres Actifs", color: "green", icon: "🎵" },
                { value: stats.totalEvents, label: "Événements", color: "orange", icon: "🎭" },
                { value: stats.activeUsers, label: "Utilisateurs Actifs", color: "teal", icon: "✅" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300 border border-gray-200"
                >
                  <div className={`text-3xl mb-3 text-${stat.color}-500`}>
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-semibold text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Section Gestion des Membres */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <span className="text-blue-500">👥</span>
                  Gestion des Membres
                </h2>
                <div className="space-y-4">
                  {[
                    { action: () => setActiveTab("users"), label: "Voir tous les Membres", icon: "👥", color: "blue" },
                    { to: "/admin/admissions", label: "Gérer les Admissions", icon: "✅", color: "green" },
                    { to: "/admin/messages", label: "Envoyer un Message", icon: "💬", color: "indigo" }
                  ].map((item, index) => (
                    item.action ? (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`w-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white py-4 px-6 rounded-xl hover:from-${item.color}-600 hover:to-${item.color}-700 transition-all duration-300 flex items-center gap-4 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={index}
                        to={item.to}
                        className={`w-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white py-4 px-6 rounded-xl hover:from-${item.color}-600 hover:to-${item.color}-700 transition-all duration-300 flex items-center gap-4 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 block text-center`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    )
                  ))}
                </div>
              </div>

              {/* Section Gestion des Événements */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <span className="text-orange-500">🎭</span>
                  Gestion des Événements
                </h2>
                <div className="space-y-4">
                  {[
                    { to: "/admin/events/create", label: "Créer un Événement", icon: "🎵", color: "orange" },
                    { to: "/admin/calendar", label: "Calendrier des Concerts", icon: "📅", color: "teal" },
                    { to: "/admin/statistics", label: "Statistiques de Participation", icon: "📊", color: "indigo" }
                  ].map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className={`w-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white py-4 px-6 rounded-xl hover:from-${item.color}-600 hover:to-${item.color}-700 transition-all duration-300 flex items-center gap-4 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 block text-center`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Actions Rapides */}
            <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <span className="text-purple-500">⚡</span>
                Actions Rapides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { to: "/admin/partitions/add", label: "Ajouter une Partition", icon: "📝", color: "gray" },
                  { to: "/admin/gallery", label: "Gérer la Galerie", icon: "🖼️", color: "red" },
                  { to: "/admin/articles/create", label: "Publier un Article", icon: "📰", color: "yellow" },
                  { to: "/admin/invite", label: "Inviter un Membre", icon: "👥", color: "green" }
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    className={`bg-${item.color}-500 hover:bg-${item.color}-600 text-white py-4 px-4 rounded-xl transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex flex-col items-center gap-2`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Activité Récente */}
            <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <span className="text-blue-500">📈</span>
                Activité Récente
              </h2>
              <div className="space-y-4">
                {recentActivity.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {getInitial(user)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                          {getSafeDisplayName(user)}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {user.role || 'non défini'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 font-medium">
                        {user.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                      </div>
                      <div className="text-xs text-gray-400">
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

// Composant de gestion des utilisateurs
const UsersManagement = ({ users, loading, onUserAction }) => {
  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement des utilisateurs...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <span className="text-blue-500">👥</span>
        Gestion des Utilisateurs
      </h2>
      
      {/* Légende des rôles */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-900 text-lg mb-4 flex items-center gap-2">
          <span>📋</span>
          Hiérarchie des Rôles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
            <div>
              <div className="font-semibold text-purple-700">Super-Admin</div>
              <div className="text-purple-600 text-xs">Accès complet</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
            <div>
              <div className="font-semibold text-green-700">Admin</div>
              <div className="text-green-600 text-xs">Doit être membre</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
            <div>
              <div className="font-semibold text-blue-700">Membre</div>
              <div className="text-blue-600 text-xs">Choriste validé</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-gray-400 rounded-full"></span>
            <div>
              <div className="font-semibold text-gray-700">User</div>
              <div className="text-gray-600 text-xs">Utilisateur standard</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitial(user)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {getSafeDisplayName(user)}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">
                        Inscrit le: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'super-admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                    user.role === 'admin' ? 'bg-green-100 text-green-800 border border-green-200' :
                    user.role === 'member' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isActive !== false ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {user.isActive !== false ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col space-y-2">
                    {user.role !== 'super-admin' && (
                      <div className="flex flex-wrap gap-2">
                        {user.role === 'user' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'promote_to_member', user)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            👥 Devenir Membre
                          </button>
                        )}
                        {user.role === 'member' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'promote_to_admin', user)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            🛡️ Promouvoir Admin
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'demote_to_member', user)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
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
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            👤 Rétrograder User
                          </button>
                        )}
                        {user.isActive !== false ? (
                          <button 
                            onClick={() => onUserAction(user.id, 'deactivate', user)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            ❌ Désactiver
                          </button>
                        ) : (
                          <button 
                            onClick={() => onUserAction(user.id, 'activate', user)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            ✅ Activer
                          </button>
                        )}
                      </div>
                    )}
                    {user.role === 'super-admin' && (
                      <span className="text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                        Super-Admin (accès complet)
                      </span>
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

// Composant de gestion des administrateurs
const AdminsManagement = ({ users, loading }) => {
  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement des administrateurs...</p>
    </div>
  );

  const admins = users.filter(user => user.role === 'admin' || user.role === 'super-admin');

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <span className="text-green-500">🛡️</span>
        Gestion des Administrateurs
      </h2>
      
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <h3 className="font-semibold text-green-900 text-lg mb-3 flex items-center gap-2">
          <span>📋</span>
          Règles de promotion administrative
        </h3>
        <div className="text-green-800 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Hiérarchie :</span>
            <span>User → Membre (choriste) → Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Super-Admin :</span>
            <span>Accès complet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Admin :</span>
            <span>Gestion limitée</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Règle :</span>
            <span>Seuls les membres peuvent devenir administrateurs</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-green-50 to-emerald-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Administrateur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Permissions</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dernière activité</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map(admin => (
              <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitial(admin)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {getSafeDisplayName(admin)}
                      </div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                      <div className="text-xs text-gray-400">
                        {admin.role === 'admin' ? 'Ancien membre promu' : 'Créateur système'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    admin.role === 'super-admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {admin.role === 'super-admin' 
                    ? 'Toutes les permissions' 
                    : (admin.permissions?.join(', ') || 'Permissions de base admin')
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.updatedAt ? new Date(admin.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}
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
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <span className="text-gray-500">⚙️</span>
        Paramètres Système
      </h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-xl mb-6 flex items-center gap-3">
              <span className="text-blue-500">🔧</span>
              Maintenance
            </h3>
            <div className="space-y-4">
              {['Vider le cache', 'Regénérer les index', 'Sauvegarde de la base'].map((action, index) => (
                <button 
                  key={index}
                  className="w-full text-left p-4 bg-white rounded-xl border border-gray-300 hover:border-blue-500 hover:shadow-md transition-all duration-300 font-medium text-gray-700 hover:text-blue-600"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-green-50 p-8 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-xl mb-6 flex items-center gap-3">
              <span className="text-green-500">📊</span>
              Analytics
            </h3>
            <div className="space-y-4">
              {['Voir les statistiques', 'Rapports d\'usage', 'Logs système'].map((action, index) => (
                <button 
                  key={index}
                  className="w-full text-left p-4 bg-white rounded-xl border border-gray-300 hover:border-green-500 hover:shadow-md transition-all duration-300 font-medium text-gray-700 hover:text-green-600"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8">
          <h3 className="font-semibold text-yellow-800 text-xl mb-4 flex items-center gap-3">
            <span>⚠️</span>
            Zone de configuration avancée
          </h3>
          <p className="text-yellow-700 leading-relaxed">
            Ces paramètres affectent le fonctionnement global de la plateforme. 
            Utilisez avec précaution et uniquement si vous comprenez parfaitement les conséquences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useAuthorization } from '../../../hooks/useAuthorization';
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useNavigate, Link } from "react-router-dom";

// Fonction utilitaire pour obtenir le nom d'affichage sécurisé
const getSafeDisplayName = (user) => {
  const displayName = user.displayName;
  
  if (typeof displayName === 'string') {
    return displayName;
  }
  
  if (displayName && typeof displayName === 'object') {
    return String(displayName);
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'Utilisateur';
};

// Fonction utilitaire pour obtenir l'initiale du nom
const getInitial = (user) => {
  const displayName = getSafeDisplayName(user);
  return displayName.charAt(0).toUpperCase();
};

const SuperAdminDashboard = () => {
  const { currentUser, userProfile } = useAuth();
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
      
      // Récupérer les membres
      const membersQuery = query(collection(db, "users"), where("role", "==", "member"));
      const membersSnapshot = await getDocs(membersQuery);
      
      // Récupérer la core team
      const coreTeamQuery = query(collection(db, "users"), where("role", "==", "core-team"));
      const coreTeamSnapshot = await getDocs(coreTeamQuery);
      
      const eventsSnapshot = await getDocs(collection(db, "events"));

      const usersData = usersSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        displayName: getSafeDisplayName(doc.data())
      }));
      
      setUsers(usersData);
      
      // Les admins sont seulement ceux avec le rôle 'admin'
      const admins = usersData.filter(user => user.role === "admin");
      
      // Utilisateurs actifs
      const activeUsers = usersData.filter(user => user.isActive !== false);

      setStats({
        totalUsers: usersData.length,
        totalAdmins: admins.length,
        totalCoreTeam: coreTeamSnapshot.size,
        totalMembers: membersSnapshot.size,
        totalEvents: eventsSnapshot.size,
        activeUsers: activeUsers.length
      });

      // Activité récente
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

  // Navigation vers l'accueil du site
  const handleGoToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement du tableau de bord Super-Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header avec informations de rôle */}
      <div className="bg-black bg-opacity-50 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Tableau de Bord Super-Admin
              </h1>
              <p className="text-purple-200 text-lg">
                Gestion complète de la plateforme C.A.S.T. • Rôle: <strong>{currentRole}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoToHome}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                🏠 Accueil du Site
              </button>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                👑 Super-Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex flex-wrap gap-4 py-6">
            {[
              { id: "overview", label: "📊 Aperçu", icon: "📊" },
              { id: "users", label: "👥 Utilisateurs", icon: "👥" },
              { id: "admins", label: "🛡️ Administrateurs", icon: "🛡️" },
              { id: "system", label: "⚙️ Système", icon: "⚙️" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-purple-600 shadow-lg transform -translate-y-1"
                    : "text-white hover:bg-white hover:bg-opacity-20 hover:text-white"
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
            {/* Statistiques */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              {[
                { value: stats.totalUsers, label: "Utilisateurs Total", color: "purple", icon: "👥" },
                { value: stats.totalAdmins, label: "Administrateurs", color: "blue", icon: "🛡️" },
                { value: stats.totalCoreTeam, label: "Core Team", color: "pink", icon: "🌟" },
                { value: stats.totalMembers, label: "Membres Actifs", color: "green", icon: "🎵" },
                { value: stats.totalEvents, label: "Événements", color: "orange", icon: "🎭" },
                { value: stats.activeUsers, label: "Utilisateurs Actifs", color: "teal", icon: "✅" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300 border border-gray-200"
                >
                  <div className={`text-3xl mb-3 text-${stat.color}-500`}>
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-semibold text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Section Gestion des Membres */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <span className="text-blue-500">👥</span>
                  Gestion des Membres
                </h2>
                <div className="space-y-4">
                  {[
                    { action: () => setActiveTab("users"), label: "Voir tous les Membres", icon: "👥", color: "blue" },
                    { to: "/admin/admissions", label: "Gérer les Admissions", icon: "✅", color: "green" },
                    { to: "/admin/messages", label: "Envoyer un Message", icon: "💬", color: "indigo" }
                  ].map((item, index) => (
                    item.action ? (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`w-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white py-4 px-6 rounded-xl hover:from-${item.color}-600 hover:to-${item.color}-700 transition-all duration-300 flex items-center gap-4 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={index}
                        to={item.to}
                        className={`w-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white py-4 px-6 rounded-xl hover:from-${item.color}-600 hover:to-${item.color}-700 transition-all duration-300 flex items-center gap-4 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 block text-center`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    )
                  ))}
                </div>
              </div>

              {/* Section Gestion des Événements */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <span className="text-orange-500">🎭</span>
                  Gestion des Événements
                </h2>
                <div className="space-y-4">
                  {[
                    { to: "/admin/events/create", label: "Créer un Événement", icon: "🎵", color: "orange" },
                    { to: "/admin/calendar", label: "Calendrier des Concerts", icon: "📅", color: "teal" },
                    { to: "/admin/statistics", label: "Statistiques de Participation", icon: "📊", color: "indigo" }
                  ].map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className={`w-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white py-4 px-6 rounded-xl hover:from-${item.color}-600 hover:to-${item.color}-700 transition-all duration-300 flex items-center gap-4 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 block text-center`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Actions Rapides */}
            <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <span className="text-purple-500">⚡</span>
                Actions Rapides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { to: "/admin/partitions/add", label: "Ajouter une Partition", icon: "📝", color: "gray" },
                  { to: "/admin/gallery", label: "Gérer la Galerie", icon: "🖼️", color: "red" },
                  { to: "/admin/articles/create", label: "Publier un Article", icon: "📰", color: "yellow" },
                  { to: "/admin/invite", label: "Inviter un Membre", icon: "👥", color: "green" }
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    className={`bg-${item.color}-500 hover:bg-${item.color}-600 text-white py-4 px-4 rounded-xl transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex flex-col items-center gap-2`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Activité Récente */}
            <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <span className="text-blue-500">📈</span>
                Activité Récente
              </h2>
              <div className="space-y-4">
                {recentActivity.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {getInitial(user)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                          {getSafeDisplayName(user)}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {user.role || 'non défini'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 font-medium">
                        {user.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                      </div>
                      <div className="text-xs text-gray-400">
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

// Composant de gestion des utilisateurs
const UsersManagement = ({ users, loading, onUserAction }) => {
  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement des utilisateurs...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <span className="text-blue-500">👥</span>
        Gestion des Utilisateurs
      </h2>
      
      {/* Légende des rôles */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-900 text-lg mb-4 flex items-center gap-2">
          <span>📋</span>
          Hiérarchie des Rôles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
            <div>
              <div className="font-semibold text-purple-700">Super-Admin</div>
              <div className="text-purple-600 text-xs">Accès complet</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
            <div>
              <div className="font-semibold text-green-700">Admin</div>
              <div className="text-green-600 text-xs">Doit être membre</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
            <div>
              <div className="font-semibold text-blue-700">Membre</div>
              <div className="text-blue-600 text-xs">Choriste validé</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-gray-400 rounded-full"></span>
            <div>
              <div className="font-semibold text-gray-700">User</div>
              <div className="text-gray-600 text-xs">Utilisateur standard</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitial(user)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {getSafeDisplayName(user)}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">
                        Inscrit le: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'super-admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                    user.role === 'admin' ? 'bg-green-100 text-green-800 border border-green-200' :
                    user.role === 'member' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isActive !== false ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {user.isActive !== false ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col space-y-2">
                    {user.role !== 'super-admin' && (
                      <div className="flex flex-wrap gap-2">
                        {user.role === 'user' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'promote_to_member', user)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            👥 Devenir Membre
                          </button>
                        )}
                        {user.role === 'member' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'promote_to_admin', user)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            🛡️ Promouvoir Admin
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <button 
                            onClick={() => onUserAction(user.id, 'demote_to_member', user)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
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
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            👤 Rétrograder User
                          </button>
                        )}
                        {user.isActive !== false ? (
                          <button 
                            onClick={() => onUserAction(user.id, 'deactivate', user)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            ❌ Désactiver
                          </button>
                        ) : (
                          <button 
                            onClick={() => onUserAction(user.id, 'activate', user)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                          >
                            ✅ Activer
                          </button>
                        )}
                      </div>
                    )}
                    {user.role === 'super-admin' && (
                      <span className="text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                        Super-Admin (accès complet)
                      </span>
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

// Composant de gestion des administrateurs
const AdminsManagement = ({ users, loading }) => {
  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement des administrateurs...</p>
    </div>
  );

  const admins = users.filter(user => user.role === 'admin' || user.role === 'super-admin');

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <span className="text-green-500">🛡️</span>
        Gestion des Administrateurs
      </h2>
      
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <h3 className="font-semibold text-green-900 text-lg mb-3 flex items-center gap-2">
          <span>📋</span>
          Règles de promotion administrative
        </h3>
        <div className="text-green-800 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Hiérarchie :</span>
            <span>User → Membre (choriste) → Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Super-Admin :</span>
            <span>Accès complet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Admin :</span>
            <span>Gestion limitée</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Règle :</span>
            <span>Seuls les membres peuvent devenir administrateurs</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-green-50 to-emerald-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Administrateur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Permissions</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dernière activité</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map(admin => (
              <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitial(admin)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {getSafeDisplayName(admin)}
                      </div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                      <div className="text-xs text-gray-400">
                        {admin.role === 'admin' ? 'Ancien membre promu' : 'Créateur système'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    admin.role === 'super-admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {admin.role === 'super-admin' 
                    ? 'Toutes les permissions' 
                    : (admin.permissions?.join(', ') || 'Permissions de base admin')
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.updatedAt ? new Date(admin.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}
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
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <span className="text-gray-500">⚙️</span>
        Paramètres Système
      </h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-xl mb-6 flex items-center gap-3">
              <span className="text-blue-500">🔧</span>
              Maintenance
            </h3>
            <div className="space-y-4">
              {['Vider le cache', 'Regénérer les index', 'Sauvegarde de la base'].map((action, index) => (
                <button 
                  key={index}
                  className="w-full text-left p-4 bg-white rounded-xl border border-gray-300 hover:border-blue-500 hover:shadow-md transition-all duration-300 font-medium text-gray-700 hover:text-blue-600"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-green-50 p-8 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-xl mb-6 flex items-center gap-3">
              <span className="text-green-500">📊</span>
              Analytics
            </h3>
            <div className="space-y-4">
              {['Voir les statistiques', 'Rapports d\'usage', 'Logs système'].map((action, index) => (
                <button 
                  key={index}
                  className="w-full text-left p-4 bg-white rounded-xl border border-gray-300 hover:border-green-500 hover:shadow-md transition-all duration-300 font-medium text-gray-700 hover:text-green-600"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8">
          <h3 className="font-semibold text-yellow-800 text-xl mb-4 flex items-center gap-3">
            <span>⚠️</span>
            Zone de configuration avancée
          </h3>
          <p className="text-yellow-700 leading-relaxed">
            Ces paramètres affectent le fonctionnement global de la plateforme. 
            Utilisez avec précaution et uniquement si vous comprenez parfaitement les conséquences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;