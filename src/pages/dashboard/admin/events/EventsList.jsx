import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="p-6">Chargement des événements...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Liste des Événements</h1>
      
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">{event.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(event.date).toLocaleDateString('fr-FR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;