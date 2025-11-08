import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const MemberDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const [rehearsals, setRehearsals] = useState([]);
  const [partitions, setPartitions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      
      // Simuler des données pour le membre
      const mockRehearsals = [
        {
          id: 1,
          title: 'Répétition Soprano',
          date: '2024-12-02',
          time: '18:00-20:00',
          status: 'confirmed',
          type: 'sectionnelle',
          location: 'Salle de répétition A'
        },
        {
          id: 2,
          title: 'Répétition Générale',
          date: '2024-12-07',
          time: '14:00-17:00',
          status: 'pending',
          type: 'generale',
          location: 'Grande salle'
        },
        {
          id: 3,
          title: 'Répétition Tous pupitres',
          date: '2024-12-09',
          time: '19:00-21:00',
          status: 'confirmed',
          type: 'generale',
          location: 'Salle principale'
        }
      ];

      const mockPartitions = [
        {
          id: 1,
          title: 'Ave Maria',
          composer: 'Franz Schubert',
          voice: 'soprano',
          difficulty: 'intermediaire',
          status: 'assigned'
        },
        {
          id: 2,
          title: 'Hallelujah',
          composer: 'Leonard Cohen',
          voice: 'tous',
          difficulty: 'facile',
          status: 'assigned'
        },
        {
          id: 3,
          title: 'O Magnum Mysterium',
          composer: 'Morten Lauridsen',
          voice: 'soprano',
          difficulty: 'avance',
          status: 'pending'
        }
      ];

      const mockEvents = [
        {
          id: 1,
          title: 'Concert de Printemps',
          date: '2024-03-15',
          time: '20:00',
          location: 'Église Saint-Louis',
          status: 'confirmed',
          type: 'concert'
        },
        {
          id: 2,
          title: 'Audition interne',
          date: '2024-02-10',
          time: '19:00',
          location: 'Studio CAST',
          status: 'pending',
          type: 'audition'
        }
      ];

      setRehearsals(mockRehearsals);
      setPartitions(mockPartitions);
      setEvents(mockEvents);
      
    } catch (error) {
      console.error('Erreur chargement données membre:', error);
    } finally {
      setLoading(false);
    }
  };

  // Composant de carte de statistique
  const StatCard = ({ icon, title, value, subtitle, color }) => {
    const colorClasses = {
      green: 'bg-green-50 border-green-200 text-green-600',
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600'
    };

    return (
      <div className={`bg-white rounded-lg shadow-sm border p-4 text-center ${colorClasses[color]}`}>
        <div className="text-2xl mb-1">{icon}</div>
        <div className="text-lg font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-600">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </div>
    );
  };

  // Composant de badge de statut
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      confirmed: { label: 'Confirmé', color: 'bg-green-100 text-green-800' },
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800' },
      assigned: { label: 'Assigné', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Terminé', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Composant de section répétitions
  const RehearsalsSection = () => (
    <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📅 Mes Répétitions</h3>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
          {rehearsals.length} répétition(s)
        </span>
      </div>
      <div className="space-y-3">
        {rehearsals.map((rehearsal) => (
          <div key={rehearsal.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-900">{rehearsal.title}</p>
                <StatusBadge status={rehearsal.status} />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📅 {new Date(rehearsal.date).toLocaleDateString('fr-FR')} - 🕒 {rehearsal.time}</p>
                <p>📍 {rehearsal.location}</p>
                <p className="text-xs text-gray-500 capitalize">{rehearsal.type}</p>
              </div>
            </div>
            <button className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
              Détails
            </button>
          </div>
        ))}
      </div>
      {rehearsals.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Aucune répétition planifiée
        </div>
      )}
    </div>
  );

  // Composant de section partitions
  const PartitionsSection = () => (
    <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🎵 Mes Partitions</h3>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          {partitions.length} partition(s)
        </span>
      </div>
      <div className="space-y-3">
        {partitions.map((partition) => (
          <div key={partition.id} className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">{partition.title}</p>
              <StatusBadge status={partition.status} />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>🎼 {partition.composer}</p>
              <div className="flex justify-between text-xs">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">🎤 {partition.voice}</span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">📊 {partition.difficulty}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-sm transition-colors">
                Télécharger
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-1 rounded text-sm transition-colors">
                Écouter
              </button>
            </div>
          </div>
        ))}
      </div>
      {partitions.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Aucune partition assignée
        </div>
      )}
    </div>
  );

  // Composant de section événements
  const EventsSection = () => (
    <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">👥 Mes Événements</h3>
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
          {events.length} événement(s)
        </span>
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-900">{event.title}</p>
                <StatusBadge status={event.status} />
              </div>
              <div className="text-sm text-gray-600">
                <p>📅 {new Date(event.date).toLocaleDateString('fr-FR')} - 🕒 {event.time}</p>
                <p>📍 {event.location}</p>
                <p className="text-xs text-gray-500 capitalize">{event.type}</p>
              </div>
            </div>
            <button className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors">
              Participer
            </button>
          </div>
        ))}
      </div>
      {events.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Aucun événement à venir
        </div>
      )}
    </div>
  );

  // Composant de section profil
  const ProfileSection = () => (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Mon Profil Membre</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {userProfile?.displayName?.charAt(0) || 'M'}
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{userProfile?.displayName || 'Membre CAST'}</p>
            <p className="text-sm text-gray-600">{userProfile?.email || currentUser?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Voix</p>
            <p className="font-medium text-gray-900">{userProfile?.vocalRange || 'Non définie'}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Statut</p>
            <StatusBadge status="confirmed" />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Date d'adhésion:</span>
            <span className="font-medium">Janvier 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dernière connexion:</span>
            <span className="font-medium">Aujourd'hui</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Répétitions ce mois:</span>
            <span className="font-medium">3/4</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors font-medium">
            Modifier profil
          </button>
          <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors font-medium">
            Mes absences
          </button>
        </div>
      </div>
    </div>
  );

  // Navigation par onglets pour mobile
  const TabNavigation = () => (
    <div className="sm:hidden mb-4">
      <select
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        <option value="overview">Aperçu</option>
        <option value="rehearsals">Répétitions</option>
        <option value="partitions">Partitions</option>
        <option value="events">Événements</option>
        <option value="profile">Profil</option>
      </select>
    </div>
  );

  // Navigation par onglets pour desktop
  const DesktopTabs = () => (
    <div className="hidden sm:flex space-x-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
      {[
        { id: 'overview', name: '📊 Aperçu', icon: '📊' },
        { id: 'rehearsals', name: '📅 Répétitions', icon: '📅' },
        { id: 'partitions', name: '🎵 Partitions', icon: '🎵' },
        { id: 'events', name: '👥 Événements', icon: '👥' },
        { id: 'profile', name: '👤 Profil', icon: '👤' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-green-100 text-green-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.name}
        </button>
      ))}
    </div>
  );

  // Contenu des onglets
  const renderTabContent = () => {
    switch (activeTab) {
      case 'rehearsals':
        return <RehearsalsSection />;
      case 'partitions':
        return <PartitionsSection />;
      case 'events':
        return <EventsSection />;
      case 'profile':
        return <ProfileSection />;
      case 'overview':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            <RehearsalsSection />
            <PartitionsSection />
            <EventsSection />
            <ProfileSection />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace membre...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* 🎵 Header Membre */}
      <div className="bg-gradient-to-r from-green-900 to-emerald-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Mon Espace Membre CAST</h1>
              <p className="text-green-200 mt-1">
                Bienvenue, {userProfile?.displayName || 'Cher membre'} !
              </p>
              <p className="text-green-300 text-sm mt-1">
                Accès complet aux ressources musicales et événements
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                <span className="mr-2 text-lg">🎵</span>
                MEMBRE ACTIF
              </span>
              <div className="hidden sm:block text-right">
                <p className="text-green-200 text-sm">Voix: {userProfile?.vocalRange || 'Non définie'}</p>
                <p className="text-green-300 text-xs">Membre depuis Jan 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Statistiques rapides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon="📅"
            title="Répétitions"
            value={rehearsals.length}
            subtitle="Ce mois"
            color="green"
          />
          <StatCard
            icon="🎵"
            title="Partitions"
            value={partitions.length}
            subtitle="Assignées"
            color="blue"
          />
          <StatCard
            icon="👥"
            title="Événements"
            value={events.length}
            subtitle="À venir"
            color="purple"
          />
          <StatCard
            icon="⭐"
            title="Participation"
            value="85%"
            subtitle="Taux de présence"
            color="orange"
          />
        </div>

        {/* Navigation et contenu */}
        <TabNavigation />
        <DesktopTabs />
        
        {/* Contenu principal */}
        <div className="mb-8">
          {renderTabContent()}
        </div>

        {/* Section informations importantes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">📢 Informations importantes</h4>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Prochaine répétition générale : Samedi 14:00-17:00</li>
            <li>• Date limite inscription concert : 10 février 2024</li>
            <li>• Nouvelles partitions disponibles dans votre espace</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;