import React from 'react';

const MemberDocuments = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Documents</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Partitions</h2>
            {/* Liste des partitions sera ajoutée ici */}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Documents administratifs</h2>
            {/* Liste des documents administratifs sera ajoutée ici */}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Autres documents</h2>
            {/* Liste des autres documents sera ajoutée ici */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDocuments;