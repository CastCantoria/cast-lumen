import React, { useState } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const EventRSVP = () => {
  const { hasPermission } = usePermissions();
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Répétition Spéciale Noël',
      type: 'repetition',
      date: '2024-01-25',
      time: '18:00-20:00',
      location: 'Salle de répétition',
      description: 'Répétition intensive pour le programme de Noël',
      participants: 22,
      maxParticipants: 30,
      deadline: '2024-01-24',
      myResponse: null
    },
    {
      id: 2,
      title: 'Concert Bénéfice',
      type: 'concert',
      date: '2024-02-14',
      time: '19:30-21:30',
      location: 'Salle des Fêtes',
      description: 'Concert au profit de la fondation locale',
      participants: 25,
      maxParticipants: 35,
      deadline: '2024-02-10',
      myResponse: 'confirmed'
    }
  ]);

  const handleRSVP = (eventId, response) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, myResponse: response } : event
    ));
  };

  if (!hasPermission('events:rsvp')) {
    return null;
  }

  const upcomingEvents = events.filter(event => !event.myResponse);
  const myEvents = events.filter(event => event.myResponse === 'confirmed');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🎟️ Participation aux Événements</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {upcomingEvents.length} en attente
          </span>
        </div>
      </div>

      {/* Événements à confirmer */}
      {upcomingEvents.length > 0 && (
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⏰</span>
            Réponse demandée
          </h4>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{event.title}</h5>
                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                      <span className="mr-2">📅</span>
                      {event.date} • {event.time}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="mr-2">📍</span>
                      {event.location}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.type === 'concert' 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {event.type === 'concert' ? 'Concert' : 'Répétition'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-orange-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{event.participants}/{event.maxParticipants}</span> participants
                    <br />
                    <span className="text-orange-600">Date limite: {event.deadline}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRSVP(event.id, 'confirmed')}
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
                    >
                      Je participe
                    </button>
                    <button
                      onClick={() => handleRSVP(event.id, 'declined')}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
                    >
                      Je décline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mes événements confirmés */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <span className="mr-2">✅</span>
          Mes participations confirmées ({myEvents.length})
        </h4>
        
        {myEvents.length > 0 ? (
          <div className="space-y-3">
            {myEvents.map((event) => (
              <div key={event.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-gray-900">{event.title}</h5>
                    <p className="text-sm text-gray-600">
                      {event.date} • {event.time} • {event.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Confirmé
                    </span>
                    <button
                      onClick={() => handleRSVP(event.id, null)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-gray-500">Aucune participation confirmée</p>
            <p className="text-sm text-gray-400 mt-1">
              Répondez aux invitations pour voir vos événements ici
            </p>
          </div>
        )}
      </div>

      {/* Statistiques de participation */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Mes statistiques</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-blue-600">
              {events.filter(e => e.myResponse === 'confirmed').length}
            </div>
            <div className="text-xs text-gray-500">Confirmés</div>
          </div>
          <div>
            <div className="text-xl font-bold text-orange-600">
              {upcomingEvents.length}
            </div>
            <div className="text-xs text-gray-500">En attente</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-600">
              {events.filter(e => e.myResponse === 'declined').length}
            </div>
            <div className="text-xs text-gray-500">Déclinés</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRSVP;