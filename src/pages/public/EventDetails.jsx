import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Détails de l'événement</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 bg-gray-100">
          {/* Image de l'événement */}
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Titre de l'événement</h2>
            <p className="text-gray-600">Date • Heure • Lieu</p>
          </div>
          
          <div className="prose max-w-none mb-6">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-700">
              {/* Description de l'événement */}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Informations</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="font-medium mr-2">Date:</span>
                  <span className="text-gray-600">--/--/----</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium mr-2">Heure:</span>
                  <span className="text-gray-600">--:--</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium mr-2">Lieu:</span>
                  <span className="text-gray-600">À définir</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Programme</h3>
              <ul className="space-y-2">
                {/* Liste des œuvres */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;