import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [repertoire, setRepertoire] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setUpcomingEvents([
        { id: 1, title: 'Concert de Noël', date: '2024-12-24', location: 'Cathédrale', type: 'concert' },
        { id: 2, title: 'Répétition Générale', date: '2024-12-20', location: 'Salle de répétition', type: 'rehearsal' },
        { id: 3, title: 'Audition Nouveaux Membres', date: '2024-12-15', location: 'Studio C.A.S.T.', type: 'audition' }
      ]);
      
      setRepertoire([
        { id: 1, title: 'Ave Maria', composer: 'Schubert', status: 'À réviser', voice: 'Tous' },
        { id: 2, title: 'Gloria', composer: 'Vivaldi', status: 'Maîtrisé', voice: 'Tous' },
        { id: 3, title: 'Hallelujah', composer: 'Handel', status: 'En apprentissage', voice: 'Soprano' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement de votre espace membre...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Tableau de Bord Membre
              </h1>
              <p className="text-green-200 text-lg">
                Bienvenue dans l'espace membre de C.A.S.T. Cantoria
              </p>
            </div>
            <div className="bg-green-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
              🎵 Membre Actif
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Informations Personnelles */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <span className="text-green-500">👤</span>
            Mon Profil Membre
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'M'}
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">{userProfile?.displayName || 'Membre'}</h3>
                <p className="text-gray-600">{currentUser?.email}</p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
                  Membre Actif
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Date d'adhésion:</span>
                <span className="font-semibold text-gray-900">
                  {userProfile?.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'À définir'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Rôle:</span>
                <span className="font-semibold text-gray-900 capitalize">{userProfile?.role || 'membre'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Voix:</span>
                <span className="font-semibold text-gray-900 capitalize">{userProfile?.voicePart || 'À définir'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Link 
                to="/profile/edit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ✏️ Modifier mon Profil
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Événements à Venir */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <span className="text-blue-500">📅</span>
              Événements à Venir
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id} 
                  className="border-l-4 border-blue-500 pl-6 py-4 bg-gradient-to-r from-blue-50 to-white rounded-r-xl hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.type === 'concert' ? 'bg-purple-100 text-purple-800' :
                      event.type === 'rehearsal' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {event.type === 'concert' ? '🎵 Concert' : 
                       event.type === 'rehearsal' ? '🎼 Répétition' : '🎤 Audition'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 flex items-center gap-2">
                    <span>📅 {new Date(event.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span>•</span>
                    <span>📍 {event.location}</span>
                  </p>
                  <Link 
                    to={`/events/${event.id}`}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium group-hover:shadow-lg"
                  >
                    Voir les détails
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Répertoire Personnel */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <span className="text-purple-500">🎼</span>
              Mon Répertoire
            </h2>
            <div className="space-y-4">
              {repertoire.map(piece => (
                <div 
                  key={piece.id} 
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {piece.title}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                      <span>🎵 {piece.composer}</span>
                      <span>•</span>
                      <span>🎤 {piece.voice}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    piece.status === 'Maîtrisé' 
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : piece.status === 'À réviser'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {piece.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Membres Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { to: "/repertoire", icon: "🎵", title: "Partitions", desc: "Accéder au répertoire", color: "blue" },
            { to: "/events", icon: "📅", title: "Calendrier", desc: "Voir tous les événements", color: "purple" },
            { to: "/members", icon: "👥", title: "Annuaire", desc: "Contacter les membres", color: "orange" }
          ].map((action, index) => (
            <Link 
              key={index}
              to={action.to}
              className={`bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 text-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center group border border-${action.color}-400 transform hover:-translate-y-2`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {action.icon}
              </div>
              <div className="font-bold text-xl mb-2">{action.title}</div>
              <div className="text-blue-100 text-sm">{action.desc}</div>
            </Link>
          ))}
        </div>

        {/* Section Actions Rapides Additionnelles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: "/profile/edit", icon: "👤", title: "Mon Profil", color: "green" },
            { to: "/messages", icon: "💬", title: "Messages", color: "indigo" },
            { to: "/documents", icon: "📋", title: "Documents", color: "red" },
            { to: "/settings", icon: "⚙️", title: "Paramètres", color: "gray" }
          ].map((action, index) => (
            <Link 
              key={index}
              to={action.to}
              className={`bg-${action.color}-500 hover:bg-${action.color}-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 text-center group border border-${action.color}-400 transform hover:-translate-y-1`}
            >
              <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {action.icon}
              </div>
              <div className="font-semibold text-sm">{action.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;