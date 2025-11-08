import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const [publicEvents, setPublicEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Simuler des données pour l'utilisateur
      const mockPublicEvents = [
        {
          id: 1,
          title: 'Concert de Printemps',
          date: '2024-03-15',
          time: '20:00',
          location: 'Église Saint-Louis',
          type: 'concert',
          price: 'gratuit',
          status: 'upcoming'
        },
        {
          id: 2,
          title: 'Portes Ouvertes CAST',
          date: '2024-03-22',
          time: '14:00-17:00',
          location: 'Studio CAST',
          type: 'discovery',
          price: 'gratuit',
          status: 'upcoming'
        },
        {
          id: 3,
          title: 'Concert de Noël',
          date: '2023-12-20',
          time: '19:30',
          location: 'Cathédrale',
          type: 'concert',
          price: 'gratuit',
          status: 'past'
        }
      ];

      const mockResources = [
        {
          id: 1,
          title: 'Présentation CAST Cantoria',
          description: 'Découvrez notre chorale et son histoire',
          type: 'document',
          category: 'information'
        },
        {
          id: 2,
          title: 'Répertoire Public',
          description: 'Extraits de nos œuvres favorites',
          type: 'audio',
          category: 'music'
        },
        {
          id: 3,
          title: 'Devenir Membre',
          description: 'Processus d\'admission et conditions',
          type: 'guide',
          category: 'membership'
        },
        {
          id: 4,
          title: 'Calendrier des activités',
          description: 'Planning des événements publics',
          type: 'calendar',
          category: 'information'
        }
      ];

      const mockActivities = [
        {
          id: 1,
          title: 'Atelier Découverte Chant',
          description: 'Initiation au chant choral',
          schedule: 'Tous les mercredis - 19h00',
          type: 'workshop',
          status: 'active'
        },
        {
          id: 2,
          title: 'Rencontres Communautaires',
          description: 'Échanges avec les membres',
          schedule: '1er samedi du mois',
          type: 'meeting',
          status: 'active'
        },
        {
          id: 3,
          title: 'Auditions Publiques',
          description: 'Séances d\'écoute',
          schedule: 'Sur rendez-vous',
          type: 'audition',
          status: 'by_appointment'
        }
      ];

      setPublicEvents(mockPublicEvents);
      setResources(mockResources);
      setActivities(mockActivities);
      
    } catch (error) {
      console.error('Erreur chargement données utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Composant de carte d'événement
  const EventCard = ({ event }) => {
    const isUpcoming = event.status === 'upcoming';
    const isPast = event.status === 'past';
    
    return (
      <div className={`p-4 rounded-lg border ${
        isUpcoming ? 'bg-blue-50 border-blue-200' : 
        isPast ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-900">{event.title}</h4>
          <span className={`text-xs px-2 py-1 rounded ${
            event.price === 'gratuit' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {event.price === 'gratuit' ? 'Gratuit' : 'Payant'}
          </span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>📅 {new Date(event.date).toLocaleDateString('fr-FR')} - 🕒 {event.time}</p>
          <p>📍 {event.location}</p>
          <div className="flex justify-between items-center mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              isUpcoming ? 'bg-blue-100 text-blue-800' : 
              isPast ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
            }`}>
              {isUpcoming ? 'À venir' : isPast ? 'Passé' : 'En cours'}
            </span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              {isUpcoming ? 'S\'inscrire' : 'Détails'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Composant de carte ressource
  const ResourceCard = ({ resource }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'document': return '📄';
        case 'audio': return '🎵';
        case 'guide': return '📖';
        case 'calendar': return '📅';
        default: return '📁';
      }
    };

    const getCategoryColor = (category) => {
      switch (category) {
        case 'information': return 'bg-blue-100 text-blue-800';
        case 'music': return 'bg-purple-100 text-purple-800';
        case 'membership': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{getIcon(resource.type)}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{resource.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
            <div className="flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(resource.category)}`}>
                {resource.category === 'information' ? 'Information' : 
                 resource.category === 'music' ? 'Musique' : 'Adhésion'}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Consulter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant de carte activité
  const ActivityCard = ({ activity }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'inactive': return 'bg-gray-100 text-gray-800';
        case 'by_appointment': return 'bg-orange-100 text-orange-800';
        default: return 'bg-blue-100 text-blue-800';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'active': return 'Actif';
        case 'inactive': return 'Inactif';
        case 'by_appointment': return 'Sur RDV';
        default: return 'Disponible';
      }
    };

    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">
            {activity.type === 'workshop' ? '🎵' : 
             activity.type === 'meeting' ? '👥' : '🎤'}
          </span>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Quand:</span> {activity.schedule}
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(activity.status)}`}>
                {getStatusText(activity.status)}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Participer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Navigation par onglets pour mobile
  const TabNavigation = () => (
    <div className="sm:hidden mb-4">
      <select
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="overview">Aperçu</option>
        <option value="events">Événements</option>
        <option value="resources">Ressources</option>
        <option value="activities">Activités</option>
        <option value="profile">Profil</option>
      </select>
    </div>
  );

  // Navigation par onglets pour desktop
  const DesktopTabs = () => (
    <div className="hidden sm:flex space-x-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
      {[
        { id: 'overview', name: '📊 Aperçu', icon: '📊' },
        { id: 'events', name: '📅 Événements', icon: '📅' },
        { id: 'resources', name: '📚 Ressources', icon: '📚' },
        { id: 'activities', name: '🎪 Activités', icon: '🎪' },
        { id: 'profile', name: '👤 Profil', icon: '👤' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-blue-100 text-blue-700'
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
      case 'events':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">📅 Événements Publics</h3>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {publicEvents.length} événement(s)
                </span>
              </div>
              <div className="space-y-4">
                {publicEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {publicEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun événement public programmé
                </div>
              )}
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">📚 Ressources</h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {resources.length} ressource(s)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
              {resources.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune ressource disponible
                </div>
              )}
            </div>
          </div>
        );

      case 'activities':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🎪 Activités</h3>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                  {activities.length} activité(s)
                </span>
              </div>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
              {activities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune activité programmée
                </div>
              )}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Mon Compte</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {userProfile?.displayName?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{userProfile?.displayName || 'Utilisateur CAST'}</p>
                    <p className="text-sm text-gray-600">{userProfile?.email || currentUser?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Rôle</p>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      Utilisateur
                    </span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Statut</p>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Actif
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'inscription:</span>
                    <span className="font-medium">Janvier 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dernière connexion:</span>
                    <span className="font-medium">Aujourd'hui</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Événements suivis:</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors font-medium">
                    Modifier profil
                  </button>
                  <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors font-medium">
                    Mes inscriptions
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'overview':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carte Événements */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">📅 Événements Publics</h3>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {publicEvents.filter(e => e.status === 'upcoming').length} à venir
                </span>
              </div>
              <div className="space-y-3">
                {publicEvents.filter(e => e.status === 'upcoming').slice(0, 2).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {publicEvents.filter(e => e.status === 'upcoming').length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Aucun événement à venir
                </div>
              )}
              <button 
                onClick={() => setActiveTab('events')}
                className="w-full mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Voir tous les événements →
              </button>
            </div>

            {/* Carte Ressources */}
            <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">📚 Ressources</h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {resources.length} disponible(s)
                </span>
              </div>
              <div className="space-y-3">
                {resources.slice(0, 3).map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('resources')}
                className="w-full mt-4 text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Explorer toutes les ressources →
              </button>
            </div>

            {/* Carte Activités */}
            <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🎪 Activités</h3>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                  {activities.length} activité(s)
                </span>
              </div>
              <div className="space-y-3">
                {activities.slice(0, 2).map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('activities')}
                className="w-full mt-4 text-purple-600 hover:text-purple-800 font-medium text-sm"
              >
                Découvrir les activités →
              </button>
            </div>

            {/* Carte Profil */}
            <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Mon Compte</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom:</span>
                  <span className="font-medium">{userProfile?.displayName || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{userProfile?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rôle:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Utilisateur</span>
                </div>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors mt-4"
                >
                  Gérer mon profil
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 👤 Header Utilisateur */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold">Mon Espace Personnel</h1>
              <p className="text-blue-200 mt-1">
                Bienvenue, {userProfile?.displayName || 'Cher utilisateur'} !
              </p>
              <p className="text-blue-300 text-sm mt-1">
                Découvrez CAST Cantoria et ses activités
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                <span className="mr-2 text-lg">👤</span>
                UTILISATEUR
              </span>
              <div className="hidden sm:block text-right">
                <p className="text-blue-200 text-sm">Membre depuis Jan 2024</p>
                <p className="text-blue-300 text-xs">Accès public</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Bienvenue dans la communauté CAST !</h2>
          <p className="text-gray-600 mb-4">
            En tant qu'utilisateur, vous avez accès aux informations publiques de la chorale. 
            Pour devenir membre et accéder à l'ensemble des fonctionnalités (partitions, répétitions, événements privés), 
            contactez-nous pour rejoindre notre belle aventure musicale.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">🎵 Concerts publics</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">📅 Calendrier</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">👥 Communauté</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">📚 Ressources</span>
          </div>
        </div>

        {/* Navigation et contenu */}
        <TabNavigation />
        <DesktopTabs />
        
        {/* Contenu principal */}
        <div className="mb-8">
          {renderTabContent()}
        </div>

        {/* Section devenir membre */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🎵 Envie de nous rejoindre ?</h3>
          <p className="text-gray-600 mb-4">
            Devenez membre de CAST Cantoria et accédez à l'ensemble des fonctionnalités : 
            partitions, répétitions, événements privés, et bien plus encore !
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Devenir Membre
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Nous Contacter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;