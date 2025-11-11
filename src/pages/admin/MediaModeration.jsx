import React from 'react';
import ModerationPanel from '../../components/admin/ModerationPanel';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { moderationService } from '../../services/moderationService';

const MediaModeration = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  // Vérifier les permissions
  React.useEffect(() => {
    if (userProfile && !moderationService.canAutoApprove(userProfile.role)) {
      navigate('/unauthorized');
    }
  }, [userProfile, navigate]);

  if (!userProfile || !moderationService.canAutoApprove(userProfile.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder au panel de modération.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Rôles autorisés :</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Super Admin</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Admin</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Modérateur</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de la page */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <span className="text-2xl text-white">🛡️</span>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Modération des Médias
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    Validez ou rejetez les médias uploadés par les membres de C.A.S.T. Cantoria
                  </p>
                </div>
              </div>
              
              {/* Informations de modération */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
                  <span className="font-medium text-gray-700">Rôle actuel :</span>{' '}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    userProfile.role === 'super-admin' 
                      ? 'bg-purple-100 text-purple-800'
                      : userProfile.role === 'admin'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {userProfile.role}
                  </span>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
                  <span className="font-medium text-gray-700">Connecté en tant que :</span>{' '}
                  {userProfile.displayName || userProfile.email}
                </div>
              </div>
            </div>
            
            {/* Actions rapides */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/gallery')}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
              >
                <span>👁️</span>
                Voir la galerie
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                <span>📊</span>
                Tableau de bord
              </button>
            </div>
          </div>
        </div>

        {/* Panel de modération */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <ModerationPanel />
        </div>

        {/* Informations pour les modérateurs */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>💡</span>
              Guide de modération
            </h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>✅ <strong>Approuver</strong> : Contenu approprié et de qualité</li>
              <li>❌ <strong>Rejeter</strong> : Contenu inapproprié ou de mauvaise qualité</li>
              <li>🖼️ <strong>Images</strong> : Vérifier la résolution et le contenu</li>
              <li>🎬 <strong>Vidéos</strong> : Contrôler la durée et la pertinence</li>
              <li>🎵 <strong>Audio</strong> : Évaluer la qualité sonore</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
              <span>⚡</span>
              Actions rapides
            </h3>
            <ul className="text-green-800 space-y-2 text-sm">
              <li>🔄 <strong>Actualiser</strong> : Vérifier les nouveaux médias</li>
              <li>👁️ <strong>Prévisualiser</strong> : Cliquer sur les miniatures</li>
              <li>📊 <strong>Statistiques</strong> : Suivre l'évolution de la modération</li>
              <li>🔍 <strong>Recherche</strong> : Filtrer par type ou statut</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModeration;