import React, { useState, useEffect } from 'react';

const AdmissionManagement = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données mockées pour la démo
  useEffect(() => {
    const mockRequests = [
      {
        id: '1',
        name: 'Marie Dubois',
        email: 'marie.dubois@email.com',
        requestDate: new Date('2024-01-10'),
        message: 'Je souhaite rejoindre la chorale pour participer aux concerts.',
        status: 'pending'
      },
      {
        id: '2', 
        name: 'Pierre Martin',
        email: 'pierre.martin@email.com',
        requestDate: new Date('2024-01-12'),
        message: 'Passionné de chant choral depuis 10 ans.',
        status: 'pending'
      }
    ];
    
    setPendingRequests(mockRequests);
    setLoading(false);
  }, []);

  const handleApprove = async (requestId) => {
    setPendingRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: 'approved' } : req)
    );
  };

  const handleReject = async (requestId) => {
    setPendingRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: 'rejected' } : req)
    );
  };

  const pendingCount = pendingRequests.filter(req => req.status === 'pending').length;

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gérer les Admissions</h1>
          <p className="text-gray-600 mt-2">
            {pendingCount} demande(s) d'adhésion en attente
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            ⏰ En attente: {pendingCount}
          </span>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {pendingRequests.filter(req => req.status === 'pending').map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Informations du demandeur */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    👤
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{request.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      📧
                      <span>{request.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  📅
                  <span>Demande le {request.requestDate.toLocaleDateString('fr-FR')}</span>
                </div>

                <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
                  {request.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
                >
                  ✅ Accepter
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition"
                >
                  ❌ Refuser
                </button>
              </div>
            </div>
          </div>
        ))}

        {pendingCount === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune demande en attente</h3>
            <p className="text-gray-600">Toutes les demandes d'adhésion ont été traitées.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionManagement;