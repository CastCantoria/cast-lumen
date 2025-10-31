import React, { useState } from 'react';

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Données mockées d'événements
  const events = [
    {
      id: 1,
      title: 'Concert de Printemps',
      date: '2024-03-15',
      time: '20:00',
      location: 'Église Saint-Pierre',
      type: 'concert'
    },
    {
      id: 2,
      title: 'Répétition Hebdomadaire',
      date: '2024-03-12',
      time: '19:30',
      location: 'Salle de répétition',
      type: 'repetition'
    }
  ];

  const getEventColor = (type) => {
    switch (type) {
      case 'concert': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'repetition': return 'bg-green-100 border-green-300 text-green-800';
      case 'meeting': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Calendrier des Événements</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier simplifié */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Vue du Mois</h3>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600">Calendrier interactif à implémenter</p>
            <p className="text-sm text-gray-500 mt-2">
              Intégration FullCalendar.js prévue
            </p>
          </div>
        </div>

        {/* Liste des événements à venir */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Événements à Venir</h3>
          
          <div className="space-y-3">
            {events.map(event => (
              <div 
                key={event.id}
                className={`p-3 rounded-lg border ${getEventColor(event.type)}`}
              >
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm mt-1">
                  📅 {new Date(event.date).toLocaleDateString('fr-FR')} 
                  à {event.time}
                </div>
                <div className="text-sm">📍 {event.location}</div>
              </div>
            ))}
            
            {events.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Aucun événement à venir
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;