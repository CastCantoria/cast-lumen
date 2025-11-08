import React from 'react';

const Community = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Communauté</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actualités</h2>
          <div className="space-y-4">
            {/* Liste des actualités sera ajoutée ici */}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Événements sociaux</h2>
          <div className="space-y-4">
            {/* Liste des événements sociaux sera ajoutée ici */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;