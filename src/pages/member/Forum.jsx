import React from 'react';

const Forum = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Forum</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="search"
            placeholder="Rechercher dans le forum..."
            className="px-4 py-2 border rounded"
          />
          
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Nouveau sujet
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Liste des sujets du forum sera ajoutée ici */}
        </div>
      </div>
    </div>
  );
};

export default Forum;