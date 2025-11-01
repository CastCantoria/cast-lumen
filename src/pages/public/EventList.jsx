import React from 'react';
import { Link } from 'react-router-dom';

const EventList = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Événements</h1>
      
      <div className="grid gap-6">
        {/* Les événements seront ajoutés ici dynamiquement */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Prochain événement</h2>
          <p className="text-gray-600 mb-4">
            Détails de l'événement à venir...
          </p>
          <Link to="/events/details/1" className="text-blue-600 hover:text-blue-700 font-medium">
            En savoir plus →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventList;