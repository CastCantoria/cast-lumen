import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/NewAuthContext";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc,
  query,
  where 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalMembers: 0,
    totalEvents: 0,
    activeUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (currentUser && userProfile?.role === "super-admin") {
      loadDashboardData();
    } else if (currentUser && userProfile?.role !== "super-admin") {
      navigate("/unauthorized");
    }
  }, [currentUser, userProfile, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Charger les statistiques depuis Firestore
      const usersSnapshot = await getDocs(collection(db, "users"));
      const membersSnapshot = await getDocs(collection(db, "members"));
      const eventsSnapshot = await getDocs(collection(db, "events"));

      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const admins = users.filter(user => 
        user.role === "admin" || user.role === "super-admin"
      );
      const activeUsers = users.filter(user => user.isActive !== false);

      setStats({
        totalUsers: users.length,
        totalAdmins: admins.length,
        totalMembers: membersSnapshot.size,
        totalEvents: eventsSnapshot.size,
        activeUsers: activeUsers.length
      });

      // Charger l'activité récente
      const recentUsers = users
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

      setRecentActivity(recentUsers);

    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action, data = {}) => {
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
        case "promote":
          await updateDoc(userRef, { 
            role: "admin",
            permissions: ["read_events", "read_members", "read_repertoire", "manage_events", "manage_members", "manage_content"],
            updatedAt: new Date()
          });
          break;
        case "demote":
          await updateDoc(userRef, { 
            role: "user",
            permissions: ["read_events", "read_repertoire"],
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">
            Chargement du tableau de bord Super-Admin...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                👑 Tableau de Bord Super-Admin
              </h1>
              <p className="text-gray-600 mt-1">
                Administration complète de la plateforme C.A.S.T. Cantoria
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Connecté en tant que: <strong>{userProfile?.displayName || currentUser?.email}</strong>
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                🚪 Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            {[
              { id: "overview", label: "📊 Aperçu", icon: "📊" },
              { id: "users", label: "👥 Utilisateurs", icon: "👥" },
              { id: "admins", label: "🛡️ Administrateurs", icon: "🛡️" },
              { id: "content", label: "📁 Contenu", icon: "📁" },
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && <OverviewTab stats={stats} recentActivity={recentActivity} setActiveTab={setActiveTab} navigate={navigate} />}
        {activeTab === "users" && <UsersTab onUserAction={handleUserAction} />}
        {activeTab === "admins" && <AdminsTab onUserAction={handleUserAction} />}
        {activeTab === "content" && <ContentTab />}
        {activeTab === "system" && <SystemTab />}
      </div>
    </div>
  );
};

// Composant Onglet Aperçu
const OverviewTab = ({ stats, recentActivity, setActiveTab, navigate }) => (
  <div className="space-y-8">
    {/* Statistiques */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {[
        { label: "Utilisateurs Totaux", value: stats.totalUsers, color: "blue", icon: "👥" },
        { label: "Administrateurs", value: stats.totalAdmins, color: "green", icon: "🛡️" },
        { label: "Membres Choristes", value: stats.totalMembers, color: "purple", icon: "🎵" },
        { label: "Événements", value: stats.totalEvents, color: "orange", icon: "📅" },
        { label: "Utilisateurs Actifs", value: stats.activeUsers, color: "teal", icon: "✅" }
      ].map(stat => (
        <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Activité Récente */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Activité Récente</h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? recentActivity.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{user.displayName || user.email}</div>
                <div className="text-sm text-gray-500">{user.role} • {user.email}</div>
              </div>
              <div className="text-xs text-gray-400">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          )) : (
            <div className="text-center text-gray-500 py-4">Aucune activité récente</div>
          )}
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Actions Rapides</h3>
        <div className="space-y-3">
          <button onClick={() => setActiveTab("users")} className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="font-medium text-blue-900">👥 Gérer les Utilisateurs</div>
            <div className="text-sm text-blue-600">Voir et gérer tous les utilisateurs</div>
          </button>
          <button onClick={() => setActiveTab("admins")} className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="font-medium text-green-900">🛡️ Gérer les Administrateurs</div>
            <div className="text-sm text-green-600">Attribuer les rôles d'administration</div>
          </button>
          <button onClick={() => navigate('/dashboard/super-admin/events')} className="w-full text-left p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <div className="font-medium text-orange-900">📅 Gérer les Événements</div>
            <div className="text-sm text-orange-600">Créer et modifier les événements</div>
          </button>
          <button onClick={() => navigate('/dashboard/super-admin/users')} className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div className="font-medium text-purple-900">⚙️ Paramètres Système</div>
            <div className="text-sm text-purple-600">Configuration de la plateforme</div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Composant Onglet Utilisateurs
const UsersTab = ({ onUserAction }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Chargement des utilisateurs...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Gestion des Utilisateurs</h2>
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
                    <div className="text-sm font-medium text-gray-900">{user.displayName || 'Non défini'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'super-admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'admin' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
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
                  <div className="flex space-x-2">
                    {user.role !== 'super-admin' && user.role !== 'admin' && (
                      <button onClick={() => onUserAction(user.id, 'promote')} className="text-green-600 hover:text-green-900">
                        Promouvoir Admin
                      </button>
                    )}
                    {user.role === 'admin' && (
                      <button onClick={() => onUserAction(user.id, 'demote')} className="text-yellow-600 hover:text-yellow-900">
                        Rétrograder
                      </button>
                    )}
                    {user.isActive !== false ? (
                      <button onClick={() => onUserAction(user.id, 'deactivate')} className="text-red-600 hover:text-red-900">
                        Désactiver
                      </button>
                    ) : (
                      <button onClick={() => onUserAction(user.id, 'activate')} className="text-green-600 hover:text-green-900">
                        Activer
                      </button>
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

// Composant Onglet Administrateurs
const AdminsTab = ({ onUserAction }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const adminsData = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role === 'admin' || user.role === 'super-admin');
      
      setAdmins(adminsData);
    } catch (error) {
      console.error("Erreur chargement admins:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Chargement des administrateurs...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🛡️ Gestion des Administrateurs</h2>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900">Gestion des privilèges d'administration</h3>
        <p className="text-sm text-blue-700 mt-1">Super-Admin: Accès complet • Admin: Gestion limitée</p>
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
                    <div className="text-sm font-medium text-gray-900">{admin.displayName || 'Non défini'}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
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
                  {admin.role === 'super-admin' ? 'Toutes les permissions' : (admin.permissions?.join(', ') || 'Permissions de base')}
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

// Composant Onglet Contenu
const ContentTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">📁 Gestion du Contenu</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
  { title: "Événements", description: "Gérer concerts et répétitions", icon: "📅", path: "/dashboard/super-admin/events" },
  { title: "Répertoire", description: "Gérer les partitions", icon: "🎵", path: "/dashboard/super-admin/repertoire" },
  { title: "Médiathèque", description: "Photos et vidéos", icon: "🖼️", path: "/dashboard/super-admin/media" },
  { title: "Articles", description: "Actualités et blogs", icon: "📝", path: "/dashboard/super-admin/articles" },
  { title: "Galerie", description: "Galerie photos", icon: "📸", path: "/dashboard/super-admin/gallery" },
  { title: "Paramètres", description: "Configuration contenu", icon: "⚙️", path: "/dashboard/super-admin/content-settings" }
      ].map(item => (
        <div key={item.title} className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">{item.icon}</div>
          <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{item.description}</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Accéder
          </button>
        </div>
      ))}
    </div>
  </div>
);

// Composant Onglet Système
const SystemTab = () => (
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

export default SuperAdminDashboard;