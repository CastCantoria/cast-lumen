import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useAuthorization } from '../../../../hooks/useAuthorization';
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useNavigate, Link } from "react-router-dom";

// Clean single SuperAdmin dashboard module
const getSafeDisplayName = (user = {}) => {
  const displayName = user.displayName;
  if (typeof displayName === 'string') return displayName;
  if (displayName && typeof displayName === 'object') return String(displayName);
  if (user.email) return user.email.split('@')[0];
  return 'Utilisateur';
};

const getInitial = (user = {}) => getSafeDisplayName(user).charAt(0).toUpperCase();

const SuperAdminDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { currentRole } = useAuthorization();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0, totalCoreTeam: 0, totalMembers: 0, totalEvents: 0, activeUsers: 0 });
  const [users, setUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (currentUser && userProfile?.role === 'super-admin') {
      loadDashboardData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, userProfile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const membersSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'member')));
      const coreTeamSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'core-team')));
      const eventsSnapshot = await getDocs(collection(db, 'events'));

      const usersData = usersSnapshot.docs.map(d => ({ id: d.id, ...d.data(), displayName: getSafeDisplayName(d.data()) }));
      setUsers(usersData);

      const admins = usersData.filter(u => u.role === 'admin');
      const activeUsers = usersData.filter(u => u.isActive !== false);

      setStats({
        totalUsers: usersData.length,
        totalAdmins: admins.length,
        totalCoreTeam: coreTeamSnapshot.size,
        totalMembers: membersSnapshot.size,
        totalEvents: eventsSnapshot.size,
        activeUsers: activeUsers.length
      });

      setRecentActivity(usersData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5));
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action, userData) => {
    try {
      if (!userId) return;
      const userRef = doc(db, 'users', userId);
      switch (action) {
        case 'activate':
          await updateDoc(userRef, { isActive: true, updatedAt: new Date() });
          break;
        case 'deactivate':
          await updateDoc(userRef, { isActive: false, updatedAt: new Date() });
          break;
        case 'promote_to_member':
          await updateDoc(userRef, { role: 'member', updatedAt: new Date() });
          break;
        case 'promote_to_admin':
          if (userData?.role === 'member') {
            await updateDoc(userRef, { role: 'admin', permissions: ['read_events', 'read_members'], updatedAt: new Date() });
          } else {
            alert('❌ Seuls les membres peuvent être promus administrateurs');
            return;
          }
          break;
        case 'demote_to_member':
          await updateDoc(userRef, { role: 'member', permissions: [], updatedAt: new Date() });
          break;
        case 'demote_to_user':
          await updateDoc(userRef, { role: 'user', permissions: [], updatedAt: new Date() });
          break;
        default:
          break;
      }
      await loadDashboardData();
    } catch (err) {
      console.error('Erreur action utilisateur:', err);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tableau de Bord Super-Admin — Rôle: {currentRole}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded">Utilisateurs: {stats.totalUsers}</div>
        <div className="p-4 bg-white rounded">Admins: {stats.totalAdmins}</div>
        <div className="p-4 bg-white rounded">Événements: {stats.totalEvents}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded">
          <h2 className="font-semibold mb-3">Gestion des Membres</h2>
          <div className="space-y-2">
            <button onClick={() => setActiveTab('users')} className="btn">Voir tous les Membres</button>
            <Link to="/dashboard/super-admin/admissions" className="btn">Gérer les Admissions</Link>
            <Link to="/dashboard/super-admin/messages" className="btn">Envoyer un Message</Link>
          </div>
        </div>

        <div className="bg-white p-4 rounded">
          <h2 className="font-semibold mb-3">Gestion des Événements</h2>
          <div className="space-y-2">
            <Link to="/dashboard/super-admin/events/create" className="btn">Créer un Événement</Link>
            <Link to="/dashboard/super-admin/calendar" className="btn">Calendrier</Link>
            <Link to="/dashboard/super-admin/statistics" className="btn">Statistiques</Link>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded">
        <h2 className="font-semibold mb-3">Actions Rapides</h2>
        <div className="flex gap-2 flex-wrap">
          <Link to="/dashboard/super-admin/partitions/add" className="btn">Ajouter une Partition</Link>
          <Link to="/dashboard/super-admin/gallery" className="btn">Gérer la Galerie</Link>
          <Link to="/dashboard/super-admin/articles/create" className="btn">Publier un Article</Link>
          <Link to="/dashboard/super-admin/invite" className="btn">Inviter un Membre</Link>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded">
        <h2 className="font-semibold mb-3">Activité Récente</h2>
        <div className="space-y-2">
          {recentActivity.map(u => (
            <div key={u.id} className="p-2 border rounded flex justify-between" onClick={() => navigate(`/dashboard/super-admin/users/${u.id}`)}>
              <div>
                <div className="font-medium">{getSafeDisplayName(u)}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </div>
              <div className="text-xs text-gray-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;