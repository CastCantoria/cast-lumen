import React from 'react';

const Attendance = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Présences</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Mes présences</h2>
        <div className="space-y-4">
          {/* Historique des présences sera ajouté ici */}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Prochaines répétitions</h2>
        <div className="space-y-4">
          {/* Liste des prochaines répétitions sera ajoutée ici */}
        </div>
      </div>
    </div>
  );
};

export default Attendance;