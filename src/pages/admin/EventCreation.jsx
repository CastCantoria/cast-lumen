import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const EventCreation = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        title: title || 'Sans titre',
        description: description || '',
        location: location || '',
        section: section || '',
        // store as a JS Date converted to Firestore timestamp on server
        date: date ? new Date(date) : null,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'events'), payload);
      setMessage('Événement créé avec succès.');
      setTitle(''); setDescription(''); setDate(''); setLocation(''); setSection('');
    } catch (err) {
      console.error('Erreur création événement:', err);
      setMessage('Erreur lors de la création de l\'événement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Créer un événement</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-xl">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded h-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date & heure</label>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lieu</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Section</label>
          <input value={section} onChange={(e) => setSection(e.target.value)} placeholder="ex: soprano, alto" className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="flex items-center space-x-4">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Création...' : 'Créer l\'événement'}</button>
          {message && <div className="text-sm text-gray-700">{message}</div>}
        </div>
      </form>
    </div>
  );
};

export default EventCreation;
