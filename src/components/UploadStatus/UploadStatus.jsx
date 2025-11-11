import React from 'react';

const UploadStatus = ({ status, title = 'Sans titre', mediaId, onClose }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: '⏳',
        text: 'En attente de modération',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      },
      approved: {
        icon: '✅',
        text: 'Approuvé et publié',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      rejected: {
        icon: '❌',
        text: 'Rejeté',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      },
      uploading: {
        icon: '📤',
        text: 'Upload en cours...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    };
    
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100`}>
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Statut de l'upload
            </h3>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Icône de statut animée */}
          <div className="flex justify-center mb-4">
            <div className={`text-4xl animate-bounce`}>
              {statusConfig.icon}
            </div>
          </div>

          {/* Titre du média */}
          <div className="text-center mb-2">
            <span className="text-sm text-gray-500">🎨 Titre:</span>
            <h4 className="text-lg font-semibold text-gray-800 mt-1">
              {title}
            </h4>
          </div>

          {/* Statut */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">📊 Statut:</span>
            <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} border`}>
              {statusConfig.icon} {statusConfig.text}
            </div>
          </div>

          {/* ID du média (si disponible) */}
          {mediaId && (
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500">🆔 ID:</span>
              <p className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded mt-1 break-all">
                {mediaId}
              </p>
            </div>
          )}

          {/* Informations supplémentaires selon le statut */}
          {status === 'pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700 text-center">
                Votre média sera examiné par un modérateur sous 24-48 heures. 
                Vous recevrez une notification une fois approuvé.
              </p>
            </div>
          )}

          {status === 'approved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-700 text-center">
                Votre média a été approuvé et est maintenant visible dans la galerie publique.
              </p>
            </div>
          )}

          {status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700 text-center">
                Votre média n'a pas été approuvé. Veuillez vérifier les guidelines de contenu.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            {status === 'pending' && (
              <button
                onClick={onClose}
                className="flex-1 bg-cast-green text-white py-2 px-4 rounded-lg hover:bg-cast-green-dark transition-colors font-medium"
              >
                Compris
              </button>
            )}
            
            {status === 'approved' && (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Fermer
                </button>
                <button
                  onClick={() => window.location.href = '/gallery'}
                  className="flex-1 bg-cast-green text-white py-2 px-4 rounded-lg hover:bg-cast-green-dark transition-colors font-medium"
                >
                  Voir la galerie
                </button>
              </>
            )}
            
            {status === 'rejected' && (
              <button
                onClick={onClose}
                className="flex-1 bg-cast-green text-white py-2 px-4 rounded-lg hover:bg-cast-green-dark transition-colors font-medium"
              >
                Compris
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Uploader un autre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStatus;