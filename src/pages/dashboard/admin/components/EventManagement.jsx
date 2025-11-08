import React, { useState } from 'react';
import { usePermissions } from '../../../../services/permissionService';

const EventManagement = () => {
  const { hasPermission } = usePermissions();
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Répétition Hebdomadaire',
      type: 'repetition',
      date: '2024-01-20',
      time: '19:00',
      location: 'Salle de répétition',
      participants: 24,
      maxParticipants: 30,
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Concert de Printemps',
      type: 'concert',
      date: '2024-03-15',
      time: '20:00',
      location: 'Église Saint-Pierre',
      participants: 28,
      maxParticipants: 30,
      status: 'planned'
    }
  ]);

  const [showEventModal, setShowEventModal] = useState(false);

  if (!hasPermission('events:manage')) {
    return <div>Accès refusé</div>;
  }

  const getEventTypeColor = (type) => {
    const colors = {
      repetition: 'bg-blue-100 text-blue-800',
      concert: 'bg-purple-100 text-purple-800',
      meeting: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      planned: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.planned;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🎭 Gestion des Événements</h2>
        <button
          onClick={() => setShowEventModal(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Nouvel événement
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{events.length}</div>
          <div className="text-sm text-blue-800">Événements total</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {events.filter(e => e.status === 'confirmed').length}
          </div>
          <div className="text-sm text-green-800">Confirmés</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {events.filter(e => e.type === 'concert').length}
          </div>
          <div className="text-sm text-purple-800">Concerts</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {events.reduce((acc, event) => acc + event.participants, 0)}
          </div>
          <div className="text-sm text-orange-800">Participations</div>
        </div>
      </div>

      {/* Liste des événements */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Heure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lieu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">
                        {event.type === 'concert' ? '🎵' : '🎭'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type === 'repetition' ? 'Répétition' : 
                           event.type === 'concert' ? 'Concert' : event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{event.date}</div>
                  <div className="text-sm text-gray-500">{event.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {event.participants}/{event.maxParticipants}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status === 'confirmed' ? 'Confirmé' : 
                     event.status === 'planned' ? 'Planifié' : 'Annulé'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Éditer
                  </button>
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    Participants
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Annuler
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal nouvel événement */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-bold mb-4">Créer un nouvel événement</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de l'événement
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'événement
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="repetition">Répétition</option>
                    <option value="concert">Concert</option>
                    <option value="meeting">Réunion</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Participants maximum
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="planned">Planifié</option>
                    <option value="confirmed">Confirmé</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Créer l'événement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;