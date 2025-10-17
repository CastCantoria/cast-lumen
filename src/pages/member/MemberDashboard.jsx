import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MemberDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tableau de Bord Membre
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Bienvenue dans votre espace membre, {currentUser?.firstName || 'Cher Choriste'} !
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-800">
                Votre espace membre est en cours de développement. 
                Bientôt vous pourrez gérer votre profil, voir les répétitions et participer aux événements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;