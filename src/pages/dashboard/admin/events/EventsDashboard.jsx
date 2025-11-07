// src/pages/dashboard/admin/events/EventsDashboard.jsx
import React, { useState, useEffect } from 'react';

const EventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setEvents([
        {
          id: '1',
          title: 'Concert de Printemps',
          description: 'Premier concert de la saison',
          date: '2024-04-15',
          time: '20:00',
          location: 'Église Saint-Pierre',
          type: 'concert',
          status: 'published'
        },
        {
          id: '2',
          title: 'Répétition générale',
          description: 'Répétition pour le concert de printemps',
          date: '2024-04-10',
          time: '19:30',
          location: 'Salle de répétition',
          type: 'repetition',
          status: 'draft'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-2xl mr-3">🎭</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Événements</h2>
            <p className="text-gray-600">{events.length} événement(s) au total</p>
          </div>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
          <span className="mr-2">+</span>
          Nouvel Événement
        </button>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                <div className="text-2xl mt-1">🎵</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(event.date).toLocaleDateString('fr-FR')} 
                    {event.time && ` à ${event.time}`} • {event.location}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{event.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {event.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
                
                <div className="flex space-x-1">
                  <button className="p-1 text-blue-600 hover:text-blue-800" title="Modifier">
                    ✏️
                  </button>
                  <button className="p-1 text-red-600 hover:text-red-800" title="Supprimer">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsDashboard;