import React, { useState } from 'react';

const MemberInviter = () => {
  const [invitations, setInvitations] = useState([
    {
      id: 1,
      email: 'nouveau.membre@email.com',
      role: 'membre',
      sentDate: '2024-01-10',
      status: 'sent'
    }
  ]);

  const [newInvitation, setNewInvitation] = useState({
    email: '',
    role: 'membre',
    message: 'Rejoignez notre chorale C.A.S.T.!'
  });

  const handleSendInvitation = (e) => {
    e.preventDefault();
    
    const invitation = {
      id: invitations.length + 1,
      ...newInvitation,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'sent'
    };

    setInvitations(prev => [...prev, invitation]);
    setNewInvitation({ email: '', role: 'membre', message: 'Rejoignez notre chorale C.A.S.T.!' });
    alert(`Invitation envoyée à ${invitation.email}`);
  };

  const handleResendInvitation = (id) => {
    alert('Invitation renvoyée!');
  };

  const handleRevokeInvitation = (id) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id));
    alert('Invitation révoquée!');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Invitation de Membres</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire d'invitation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Nouvelle Invitation</h3>
          
          <form onSubmit={handleSendInvitation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email du membre
              </label>
              <input
                type="email"
                value={newInvitation.email}
                onChange={(e) => setNewInvitation(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="email@exemple.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle attribué
              </label>
              <select
                value={newInvitation.role}
                onChange={(e) => setNewInvitation(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="membre">Membre</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message personnalisé
              </label>
              <textarea
                value={newInvitation.message}
                onChange={(e) => setNewInvitation(prev => ({ ...prev, message: e.target.value }))}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Message d'invitation..."
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              Envoyer l'invitation
            </button>
          </form>
        </div>

        {/* Historique des invitations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Invitations Envoyées ({invitations.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {invitations.map(invitation => (
              <div key={invitation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-800">{invitation.email}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      Rôle: {invitation.role}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    invitation.status === 'sent' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {invitation.status === 'sent' ? 'Envoyée' : 'Acceptée'}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  Envoyée le {invitation.sentDate}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResendInvitation(invitation.id)}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    Renvoyer
                  </button>
                  <button
                    onClick={() => handleRevokeInvitation(invitation.id)}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Révoquer
                  </button>
                </div>
              </div>
            ))}
            
            {invitations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune invitation envoyée
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberInviter;