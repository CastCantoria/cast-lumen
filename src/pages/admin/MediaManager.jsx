import { useState } from 'react';
import ModerationPanel from '../../components/admin/ModerationPanel';
import { RequireRole } from '../../components/auth/RequireRole'; // ✅ Import named

const MediaManager = () => {
  const [activeTab, setActiveTab] = useState('moderation');

  return (
    <RequireRole allowedRoles={['admin', 'moderator', 'super-admin']}>
      <div className="media-manager min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Médias</h1>
            <p className="text-gray-600">Modération et gestion des contenus multimédias de la chorale</p>
          </div>
          
          {/* Navigation par onglets */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('moderation')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'moderation'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ⏳ Modération en attente
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'approved'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ✅ Médias approuvés
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'rejected'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ❌ Médias rejetés
                </button>
              </nav>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'moderation' && (
              <div className="p-6">
                <ModerationPanel />
              </div>
            )}
            
            {activeTab === 'approved' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="text-green-500 text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Médias Approuvés</h3>
                  <p className="text-gray-600">Cette section affichera bientôt les médias approuvés</p>
                </div>
              </div>
            )}
            
            {activeTab === 'rejected' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="text-red-500 text-6xl mb-4">❌</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Médias Rejetés</h3>
                  <p className="text-gray-600">Cette section affichera bientôt les médias rejetés</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireRole>
  );
};

export default MediaManager;