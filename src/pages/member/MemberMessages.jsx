import React from 'react';

const MemberMessages = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-6">
          <div className="w-1/3">
            <h2 className="text-xl font-semibold mb-4">Conversations</h2>
            {/* Liste des conversations sera ajoutée ici */}
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            {/* Messages de la conversation sélectionnée seront ajoutés ici */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberMessages;