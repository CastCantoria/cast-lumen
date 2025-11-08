import React, { useState } from 'react';
import SubPageHeader from '../layout/SubPageHeader';

const EventCreation = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'concert'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Création événement:', formData);
    alert('Événement créé avec succès!');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div>
      <SubPageHeader title="🎭 Gestion des Événements - Créer" />
      <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Créer un Événement</h2>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre de l'événement
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: Concert de Printemps"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Description de l'événement..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heure
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lieu
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: Église Saint-Pierre"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type d'événement
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="concert">Concert</option>
            <option value="repetition">Répétition</option>
            <option value="meeting">Réunion</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
        >
          Créer l'événement
        </button>
      </form>
      </div>
    </div>
  );
};

export default EventCreation;