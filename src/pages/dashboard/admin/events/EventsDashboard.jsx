import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

const EventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'concert',
    status: 'planned',
    maxParticipants: '',
    price: '0'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsQuery = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Erreur chargement événements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateDoc(doc(db, 'events', editingEvent.id), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, 'events'), {
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          participants: []
        });
      }
      setShowForm(false);
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'concert',
        status: 'planned',
        maxParticipants: '',
        price: '0'
      });
      fetchEvents();
    } catch (error) {
      console.error('Erreur sauvegarde événement:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      status: event.status,
      maxParticipants: event.maxParticipants,
      price: event.price
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await deleteDoc(doc(db, 'events', eventId));
        fetchEvents();
      } catch (error) {
        console.error('Erreur suppression événement:', error);
      }
    }
  };

  const getEventStats = () => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter(event => 
      new Date(event.date) >= new Date() && event.status !== 'cancelled'
    ).length;
    const participants = events.reduce((total, event) => 
      total + (event.participants?.length || 0), 0
    );

    return { totalEvents, upcomingEvents, participants };
  };

  const stats = getEventStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">🎭 Gestion des Événements</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-4 sm:mt-0"
        >
          + Nouvel Événement
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4 text-center">
          <div className="text-2xl text-blue-600 mb-1">📅</div>
          <div className="text-lg font-bold text-gray-900">{stats.totalEvents}</div>
          <div className="text-sm text-gray-600">Événements total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4 text-center">
          <div className="text-2xl text-green-600 mb-1">🎯</div>
          <div className="text-lg font-bold text-gray-900">{stats.upcomingEvents}</div>
          <div className="text-sm text-gray-600">À venir</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4 text-center">
          <div className="text-2xl text-purple-600 mb-1">👥</div>
          <div className="text-lg font-bold text-gray-900">{stats.participants}</div>
          <div className="text-sm text-gray-600">Participants</div>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel Événement'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="concert">Concert</option>
                    <option value="rehearsal">Répétition</option>
                    <option value="meeting">Réunion</option>
                    <option value="workshop">Atelier</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planned">Planifié</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="cancelled">Annulé</option>
                    <option value="completed">Terminé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Participants max</label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                    setFormData({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      location: '',
                      type: 'concert',
                      status: 'planned',
                      maxParticipants: '',
                      price: '0'
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingEvent ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des événements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Événement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lieu
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500 capitalize">{event.type}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{event.location}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      event.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status === 'confirmed' ? 'Confirmé' :
                       event.status === 'planned' ? 'Planifié' :
                       event.status === 'cancelled' ? 'Annulé' : 'Terminé'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.participants?.length || 0}
                      {event.maxParticipants && ` / ${event.maxParticipants}`}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {events.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun événement créé</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Créer le premier événement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsDashboard;