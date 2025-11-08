// src/pages/private/Newsletter.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Newsletter = () => {
  const { userProfile } = useAuth();
  const [preferences, setPreferences] = useState({
    events: true,
    rehearsals: true,
    news: true,
    community: true
  });

  const [frequency, setFrequency] = useState('weekly');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Sauvegarder les préférences
    console.log('Préférences sauvegardées:', { preferences, frequency });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* En-tête */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">Newsletter</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez vos préférences de newsletter
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Préférences de contenu */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Type de contenu</h3>
              <p className="mt-1 text-sm text-gray-500">
                Sélectionnez les types d'informations que vous souhaitez recevoir
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="events"
                      name="events"
                      type="checkbox"
                      checked={preferences.events}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        events: e.target.checked
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="events" className="font-medium text-gray-700">
                      Événements
                    </label>
                    <p className="text-gray-500">
                      Concerts, représentations et événements spéciaux
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="rehearsals"
                      name="rehearsals"
                      type="checkbox"
                      checked={preferences.rehearsals}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        rehearsals: e.target.checked
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="rehearsals" className="font-medium text-gray-700">
                      Répétitions
                    </label>
                    <p className="text-gray-500">
                      Planning des répétitions et changements
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="news"
                      name="news"
                      type="checkbox"
                      checked={preferences.news}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        news: e.target.checked
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="news" className="font-medium text-gray-700">
                      Actualités
                    </label>
                    <p className="text-gray-500">
                      Nouvelles de la chorale et articles du blog
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="community"
                      name="community"
                      type="checkbox"
                      checked={preferences.community}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        community: e.target.checked
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="community" className="font-medium text-gray-700">
                      Communauté
                    </label>
                    <p className="text-gray-500">
                      Activités communautaires et annonces des membres
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fréquence */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Fréquence</h3>
              <p className="mt-1 text-sm text-gray-500">
                À quelle fréquence souhaitez-vous recevoir nos newsletters ?
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="daily"
                    name="frequency"
                    type="radio"
                    value="daily"
                    checked={frequency === 'daily'}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="daily" className="ml-3 text-sm font-medium text-gray-700">
                    Quotidienne
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="weekly"
                    name="frequency"
                    type="radio"
                    value="weekly"
                    checked={frequency === 'weekly'}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="weekly" className="ml-3 text-sm font-medium text-gray-700">
                    Hebdomadaire
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="monthly"
                    name="frequency"
                    type="radio"
                    value="monthly"
                    checked={frequency === 'monthly'}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="monthly" className="ml-3 text-sm font-medium text-gray-700">
                    Mensuelle
                  </label>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="mt-6 flex items-center justify-end space-x-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setPreferences({
                  events: true,
                  rehearsals: true,
                  news: true,
                  community: true
                })}
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sauvegarder les préférences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;