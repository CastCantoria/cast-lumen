import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadUsers();
    loadEvents();
  }, []);

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = [];
      
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date()
        });
      });

      setAllUsers(usersData);
      setAdmins(usersData.filter(u => u.role === 'admin' || u.role === 'super-admin'));
      setMembers(usersData.filter(u => u.role === 'member' || u.role === 'contributor'));
      setUsers(usersData.filter(u => u.role === 'visitor' || !u.role));
      
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const eventsSnapshot = await getDocs(query(collection(db, 'events'), orderBy('date', 'asc')));
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        endDate: doc.data().endDate?.toDate()
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Erreur chargement événements:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date()
      });
      await loadUsers();
    } catch (error) {
      console.error('Erreur mise à jour rôle:', error);
      alert('Erreur lors de la mise à jour du rôle');
    }
  };

  const deleteUser = async (userId, userEmail) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userEmail} ?`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        await loadUsers();
      } catch (error) {
        console.error('Erreur suppression utilisateur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const exportToCSV = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(user => ({
      'Prénom': user.firstName || '',
      'Nom': user.lastName || '',
      'Email': user.email,
      'Rôle': user.role,
      'Date création': user.createdAt.toLocaleDateString('fr-FR'),
      'Dernière modification': user.updatedAt?.toDate?.()?.toLocaleDateString('fr-FR') || ''
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const exportToPDF = (data, filename) => {
    const content = data.map(user => 
      `${user.firstName || ''} ${user.lastName || ''} - ${user.email} - ${user.role}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, `${filename}.txt`);
  };

  const filteredUsers = (users) => {
    return users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
        )}
      </div>
    </th>
  );

  const UserTable = ({ users, title, editable = false, exportable = false }) => {
    const displayUsers = filteredUsers(users);
    
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title} ({displayUsers.length})</h3>
          {exportable && (
            <div className="flex space-x-2">
              <button
                onClick={() => exportToCSV(displayUsers, title)}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
              >
                📊 Excel
              </button>
              <button
                onClick={() => exportToPDF(displayUsers, title)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                📄 PDF
              </button>
            </div>
          )}
        </div>

        {/* Barre de recherche */}
        <div className="p-4 bg-gray-50 border-b">
          <input
            type="text"
            placeholder="Rechercher par nom, email ou rôle..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader field="firstName">Utilisateur</SortableHeader>
                <SortableHeader field="email">Email</SortableHeader>
                <SortableHeader field="role">Rôle</SortableHeader>
                <SortableHeader field="createdAt">Date création</SortableHeader>
                {editable && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayUsers.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-yellow-600 rounded-full flex items-center justify-center">
                        {userData.photoURL ? (
                          <img src={userData.photoURL} alt="Avatar" className="h-10 w-10 rounded-full" />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {(userData.firstName?.charAt(0) || userData.email?.charAt(0)).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {userData.firstName && userData.lastName 
                            ? `${userData.firstName} ${userData.lastName}`
                            : 'Non renseigné'
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userData.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userData.role === 'super-admin' ? 'bg-purple-100 text-purple-800' :
                      userData.role === 'admin' ? 'bg-red-100 text-red-800' :
                      userData.role === 'contributor' ? 'bg-green-100 text-green-800' :
                      userData.role === 'member' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {userData.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userData.createdAt.toLocaleDateString('fr-FR')}
                  </td>
                  {editable && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {userData.role !== 'super-admin' && user.role === 'super-admin' && (
                        <>
                          <select
                            value={userData.role}
                            onChange={(e) => updateUserRole(userData.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          >
                            <option value="visitor">Visiteur</option>
                            <option value="member">Membre</option>
                            <option value="contributor">Contributeur</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => deleteUser(userData.id, userData.email)}
                            className="text-red-600 hover:text-red-900 ml-2"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                      {user.role === 'admin' && ['visitor', 'member'].includes(userData.role) && (
                        <select
                          value={userData.role}
                          onChange={(e) => updateUserRole(userData.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          <option value="visitor">Visiteur</option>
                          <option value="member">Membre</option>
                        </select>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {displayUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Aucun utilisateur trouvé pour cette recherche' : 'Aucun utilisateur'}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Statistiques des événements
  const getEventStats = () => {
    const now = new Date();
    const upcomingEvents = events.filter(e => e.date >= now && e.status === 'published');
    const pastEvents = events.filter(e => e.date < now);
    const totalBookings = events.reduce((sum, e) => sum + (e.bookedSeats || 0), 0);
    
    return { upcomingEvents, pastEvents, totalBookings };
  };

  const eventStats = getEventStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* En-tête avec message de bienvenue */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Tableau de Bord {user.role === 'super-admin' ? 'Super-Admin' : 'Admin'}
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg text-gray-700">
                  👋 Bonjour, <strong>{user.firstName || user.email}</strong> !
                </p>
                <p className="text-sm text-yellow-600 font-semibold capitalize">
                  Rôle: {user.role} | Accès: {user.role === 'super-admin' ? 'Complet' : 'Administrateur'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-800">{allUsers.length}</p>
                <p className="text-sm text-gray-600">Utilisateurs total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cartes de navigation rapide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Carte Utilisateurs */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-green-800 mb-2">{allUsers.length}</div>
            <div className="text-gray-600 mb-4">Utilisateurs Total</div>
            <Link 
              to="/admin/users" 
              className="inline-block bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors text-sm"
            >
              Gérer les utilisateurs
            </Link>
          </div>

          {/* Carte Événements */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">{events.length}</div>
            <div className="text-gray-600 mb-4">Événements Total</div>
            <Link 
              to="/admin/events" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Gérer les événements
            </Link>
          </div>

          {/* Carte Réservations */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-purple-600 mb-2">{eventStats.totalBookings}</div>
            <div className="text-gray-600 mb-4">Réservations Total</div>
            <Link 
              to="/admin/events?tab=bookings" 
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Voir les réservations
            </Link>
          </div>

          {/* Carte Prochains Événements */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{eventStats.upcomingEvents.length}</div>
            <div className="text-gray-600 mb-4">Événements à Venir</div>
            <Link 
              to="/admin/events?filter=upcoming" 
              className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              Voir les événements
            </Link>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button onClick={() => setActiveTab('overview')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-green-800 text-green-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                📊 Vue d'ensemble
              </button>
              
              {user.role === 'super-admin' && (
                <button onClick={() => setActiveTab('admins')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'admins' ? 'border-green-800 text-green-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  👥 Admins ({admins.length})
                </button>
              )}
              
              <button onClick={() => setActiveTab('members')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'members' ? 'border-green-800 text-green-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                🎵 Membres ({members.length})
              </button>
              
              <button onClick={() => setActiveTab('users')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-green-800 text-green-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                👋 Utilisateurs ({users.length})
              </button>

              <button onClick={() => setActiveTab('events')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-green-800 text-green-800' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                📅 Événements ({events.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Statistiques Utilisateurs */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Statistiques Utilisateurs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">{admins.length}</div>
                    <div className="text-sm text-gray-600">Administrateurs</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{members.length}</div>
                    <div className="text-sm text-gray-600">Membres & Contributeurs</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{users.length}</div>
                    <div className="text-sm text-gray-600">Visiteurs</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{allUsers.length}</div>
                    <div className="text-sm text-gray-600">Total Utilisateurs</div>
                  </div>
                </div>
              </div>

              {/* Statistiques Événements */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎪 Statistiques Événements</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{events.length}</div>
                    <div className="text-sm text-gray-600">Total Événements</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{eventStats.upcomingEvents.length}</div>
                    <div className="text-sm text-gray-600">À Venir</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{eventStats.pastEvents.length}</div>
                    <div className="text-sm text-gray-600">Terminés</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{eventStats.totalBookings}</div>
                    <div className="text-sm text-gray-600">Réservations</div>
                  </div>
                </div>
              </div>

              {/* Actions Rapides */}
              <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Actions Rapides</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link 
                    to="/admin/events?action=create" 
                    className="bg-green-800 text-white p-4 rounded-lg text-center hover:bg-green-900 transition-colors"
                  >
                    <div className="text-2xl mb-2">➕</div>
                    <div className="font-semibold">Nouvel Événement</div>
                  </Link>
                  <Link 
                    to="/admin/users" 
                    className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                  >
                    <div className="text-2xl mb-2">👥</div>
                    <div className="font-semibold">Gérer Utilisateurs</div>
                  </Link>
                  <Link 
                    to="/admin/events" 
                    className="bg-yellow-600 text-white p-4 rounded-lg text-center hover:bg-yellow-700 transition-colors"
                  >
                    <div className="text-2xl mb-2">📅</div>
                    <div className="font-semibold">Voir Événements</div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admins' && user.role === 'super-admin' && (
            <UserTable 
              users={admins} 
              title="Administrateurs" 
              editable={true}
              exportable={true}
            />
          )}

          {activeTab === 'members' && (
            <UserTable 
              users={members} 
              title="Membres & Contributeurs"
              editable={user.role === 'super-admin' || user.role === 'admin'}
              exportable={true}
            />
          )}

          {activeTab === 'users' && (
            <UserTable 
              users={users} 
              title="Visiteurs"
              editable={user.role === 'super-admin' || user.role === 'admin'}
              exportable={true}
            />
          )}

          {activeTab === 'events' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Événements ({events.length})</h3>
                <Link 
                  to="/admin/events" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold"
                >
                  Gérer les événements →
                </Link>
              </div>
              <div className="p-6">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun événement créé</p>
                    <Link 
                      to="/admin/events?action=create" 
                      className="inline-block mt-4 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors"
                    >
                      Créer le premier événement
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.slice(0, 6).map(event => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {event.date?.toLocaleDateString('fr-FR')} • {event.location}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            event.status === 'published' ? 'bg-green-100 text-green-800' :
                            event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {event.status}
                          </span>
                          <span className="text-gray-500">
                            {event.bookedSeats || 0}/{event.capacity || 0} places
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;