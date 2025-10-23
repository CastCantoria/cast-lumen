import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Mon Espace C.A.S.T.</h1>
          <p className="text-gray-300">
            Bienvenue dans votre espace personnel
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Carte de Bienvenue */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
            {userProfile?.displayName?.charAt(0) || 'U'}
          </div>
          <h2 className="text-2xl font-bold mb-2">Bonjour, {userProfile?.displayName || 'Utilisateur'} !</h2>
          <p className="text-gray-600 mb-6">
            Merci de faire partie de la communauté C.A.S.T. Cantoria
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-bold text-lg">0</div>
              <div className="text-gray-600">Événements</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 font-bold text-lg">Membre</div>
              <div className="text-gray-600">Statut</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-purple-600 font-bold text-lg">Nouveau</div>
              <div className="text-gray-600">Niveau</div>
            </div>
          </div>
        </div>

        {/* Actions Disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Découvrir C.A.S.T.</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/about')}
                className="w-full text-left p-3 hover:bg-gray-50 rounded transition"
              >
                <span className="text-blue-500 mr-2">ℹ️</span>
                Notre Histoire et Mission
              </button>
              <button 
                onClick={() => navigate('/repertoire')}
                className="w-full text-left p-3 hover:bg-gray-50 rounded transition"
              >
                <span className="text-green-500 mr-2">📜</span>
                Explorer le Répertoire
              </button>
              <button 
                onClick={() => navigate('/gallery')}
                className="w-full text-left p-3 hover:bg-gray-50 rounded transition"
              >
                <span className="text-purple-500 mr-2">🖼️</span>
                Voir nos Galeries
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Participer</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/events')}
                className="w-full text-left p-3 hover:bg-gray-50 rounded transition"
              >
                <span className="text-orange-500 mr-2">🎵</span>
                Voir nos Concerts
              </button>
              <button 
                onClick={() => navigate('/blog')}
                className="w-full text-left p-3 hover:bg-gray-50 rounded transition"
              >
                <span className="text-red-500 mr-2">📰</span>
                Lire notre Blog
              </button>
              <button 
                onClick={() => navigate('/join')}
                className="w-full text-left p-3 hover:bg-gray-50 rounded transition"
              >
                <span className="text-teal-500 mr-2">👥</span>
                Rejoindre la Chorale
              </button>
            </div>
          </div>
        </div>

        {/* Prochaines Étapes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3 text-yellow-800">🚀 Prochaines Étapes</h3>
          <div className="space-y-2 text-yellow-700">
            <div>• Complétez votre profil</div>
            <div>• Explorez notre répertoire musical</div>
            <div>• Assistez à nos prochains concerts</div>
            <div>• Contactez-nous pour plus d'informations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;