import React, { useState } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const PersonalSchedule = () => {
  const { hasPermission } = usePermissions();
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Répétition Hebdomadaire',
      type: 'repetition',
      date: '2024-01-20',
      time: '19:00-21:00',
      location: 'Salle de répétition',
      status: 'confirmed',
      myStatus: 'confirmed'
    },
    {
      id: 2,
      title: 'Concert de Printemps',
      type: 'concert',
      date: '2024-03-15',
      time: '20:00-22:00',
      location: 'Église Saint-Pierre',
      status: 'planned',
      myStatus: 'pending'
    }
  ]);

  const handleRSVP = (eventId, status) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, myStatus: status } : event
    ));
  };

  if (!hasPermission('schedule:view')) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📅 Mon Planning</h3>
        <span className="text-sm text-gray-500">{events.length} événement(s)</span>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <span className="mr-2">🕒</span>
                  {event.date} • {event.time}
                </p>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="mr-2">📍</span>
                  {event.location}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                event.type === 'concert' 
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {event.type === 'concert' ? 'Concert' : 'Répétition'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                event.myStatus === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : event.myStatus === 'declined'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {event.myStatus === 'confirmed' ? '✅ Confirmé' :
                 event.myStatus === 'declined' ? '❌ Décliné' : '⏳ En attente'}
              </span>

              <div className="flex space-x-2">
                {event.myStatus !== 'confirmed' && (
                  <button
                    onClick={() => handleRSVP(event.id, 'confirmed')}
                    className="bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Participer
                  </button>
                )}
                {event.myStatus !== 'declined' && (
                  <button
                    onClick={() => handleRSVP(event.id, 'declined')}
                    className="bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Décliner
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📅</div>
          <p className="text-gray-500">Aucun événement à venir</p>
        </div>
      )}
    </div>
  );
};

export default PersonalSchedule;