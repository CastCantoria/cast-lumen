import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const MemberDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [repertoireProgress, setRepertoireProgress] = useState([]);
  const [rehearsals, setRehearsals] = useState([]);

  useEffect(() => {
    // Simulation de données membres
    const mockEvents = [
      { id: 1, title: 'Concert de Noël', date: '2024-12-24', time: '20:00', location: 'Cathédrale Saint-Louis', type: 'concert' },
      { id: 2, title: 'Répétition Générale', date: '2024-12-20', time: '19:30', location: 'Salle de répétition', type: 'rehearsal' },
      { id: 3, title: 'Audition Nouveaux Membres', date: '2024-11-15', time: '18:00', location: 'Studio C.A.S.T.', type: 'audition' }
    ];

    const mockRepertoire = [
      { id: 1, title: 'Ave Maria', composer: 'Schubert', status: 'À réviser', progress: 60 },
      { id: 2, title: 'Gloria', composer: 'Vivaldi', status: 'Maîtrisé', progress: 95 },
      { id: 3, title: 'Hallelujah', composer: 'Cohen', status: 'En apprentissage', progress: 30 }
    ];

    const mockRehearsals = [
      { id: 1, date: '2024-11-10', time: '19:00-21:00', focus: 'Ave Maria - Parties Soprano' },
      { id: 2, date: '2024-11-17', time: '19:00-21:00', focus: 'Gloria - Ensemble' }
    ];

    setUpcomingEvents(mockEvents);
    setRepertoireProgress(mockRepertoire);
    setRehearsals(mockRehearsals);
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case 'concert': return '🎵';
      case 'rehearsal': return '🎼';
      case 'audition': return '👥';
      default: return '📅';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Maîtrisé': return 'bg-green-100 text-green-800';
      case 'À réviser': return 'bg-yellow-100 text-yellow-800';
      case 'En apprentissage': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de Bord Membre</h1>
              <p className="text-green-200">
                Bienvenue dans votre espace choriste, {userProfile?.displayName || currentUser?.firstName || 'Cher Membre'} !
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                🏠 Accueil
              </Link>
              <div className="bg-emerald-600 px-3 py-1 rounded-full text-sm font-medium">
                🎵 Choriste
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistiques Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link 
            to="/member/events"
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="text-xl font-bold text-gray-800">{upcomingEvents.length}</div>
            <div className="text-gray-600">Événements à venir</div>
          </Link>
          
          <Link 
            to="/member/repertoire"
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-2xl mb-2">🎼</div>
            <div className="text-xl font-bold text-gray-800">{repertoireProgress.length}</div>
            <div className="text-gray-600">Pièces en cours</div>
          </Link>
          
          <Link 
            to="/member/rehearsals"
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="text-xl font-bold text-gray-800">{rehearsals.length}</div>
            <div className="text-gray-600">Répétitions</div>
          </Link>
          
          <Link 
            to="/member/profile"
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
          >
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-xl font-bold text-gray-800">Membre</div>
            <div className="text-gray-600">Statut actif</div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Événements à Venir */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">📅 Événements à Venir</h2>
              <Link 
                to="/member/events"
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Voir tout →
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="border-l-4 border-green-500 pl-4 py-3 hover:bg-gray-50 rounded-r cursor-pointer transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getEventIcon(event.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        📅 {event.date} • 🕒 {event.time}
                      </p>
                      <p className="text-sm text-gray-500">📍 {event.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progression du Répertoire */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">🎼 Mon Répertoire</h2>
              <Link 
                to="/member/repertoire"
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Voir tout →
              </Link>
            </div>
            <div className="space-y-4">
              {repertoireProgress.map(piece => (
                <div key={piece.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{piece.title}</div>
                      <div className="text-sm text-gray-600">{piece.composer}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(piece.status)}`}>
                      {piece.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${piece.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {piece.progress}% maîtrisé
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prochaines Répétitions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">👥 Prochaines Répétitions</h2>
            <Link 
              to="/member/rehearsals"
              className="text-green-600 hover:text-green-800 font-medium text-sm"
            >
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rehearsals.map(rehearsal => (
              <div 
                key={rehearsal.id}
                onClick={() => navigate(`/member/rehearsals/${rehearsal.id}`)}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🎼</span>
                  <div>
                    <div className="font-semibold text-gray-900">Répétition</div>
                    <div className="text-sm text-gray-600">
                      📅 {rehearsal.date} • 🕒 {rehearsal.time}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Focus :</strong> {rehearsal.focus}
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Présence requise
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            to="/member/partitions"
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-center block"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold">Partitions</div>
            <div className="text-sm opacity-90">Accéder aux partitions</div>
          </Link>
          
          <Link 
            to="/member/attendance"
            className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-center block"
          >
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold">Présences</div>
            <div className="text-sm opacity-90">Gérer mes absences</div>
          </Link>
          
          <Link 
            to="/member/messages"
            className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-center block"
          >
            <div className="text-2xl mb-2">💬</div>
            <div className="font-semibold">Messages</div>
            <div className="text-sm opacity-90">Communication interne</div>
          </Link>
          
          <Link 
            to="/member/documents"
            className="bg-teal-600 text-white p-6 rounded-lg hover:bg-teal-700 transition text-center block"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold">Documents</div>
            <div className="text-sm opacity-90">Ressources partagées</div>
          </Link>
        </div>

        {/* Section Outils Pratiques */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">🛠️ Outils Pratiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/member/voice-recorder"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center block"
            >
              <div className="text-2xl mb-2">🎤</div>
              <div className="font-medium">Enregistreur Vocal</div>
              <div className="text-sm text-gray-600">Pratiquer votre partie</div>
            </Link>
            
            <Link 
              to="/member/metronome"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center block"
            >
              <div className="text-2xl mb-2">⌚</div>
              <div className="font-medium">Métronome</div>
              <div className="text-sm text-gray-600">Travailler le rythme</div>
            </Link>
            
            <Link 
              to="/member/tuner"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center block"
            >
              <div className="text-2xl mb-2">🎵</div>
              <div className="font-medium">Accordeur</div>
              <div className="text-sm text-gray-600">Vérifier votre justesse</div>
            </Link>
          </div>
        </div>

        {/* Section Communauté */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">👥 Communauté C.A.S.T.</h2>
            <Link 
              to="/member/community"
              className="text-green-600 hover:text-green-800 font-medium text-sm"
            >
              Explorer →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              to="/member/directory"
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition block"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">📇</div>
                <div>
                  <div className="font-semibold">Annuaire des Membres</div>
                  <div className="text-sm text-gray-600">Contacter les autres choristes</div>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/member/forum"
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition block"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">💬</div>
                <div>
                  <div className="font-semibold">Forum Interne</div>
                  <div className="text-sm text-gray-600">Échanger avec la communauté</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;