import React from 'react';

const MemberProfile = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mon profil</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            {/* Formulaire d'informations personnelles sera ajouté ici */}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Préférences</h2>
            {/* Formulaire de préférences sera ajouté ici */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;