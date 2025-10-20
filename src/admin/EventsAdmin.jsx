import React from 'react'

const EventsAdmin = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Événements</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Interface d'administration des événements
        </p>
        <div className="space-y-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Créer un événement
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-4">
            Voir les réservations
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventsAdmin