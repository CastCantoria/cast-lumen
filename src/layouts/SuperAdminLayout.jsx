import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const SuperAdminLayout = ({ children }) => {
  const { userProfile, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Remonter en haut de la page à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [location.pathname]);

  // 🔧 SOLUTION RAPIDE : Vérification directe avec useAuth
  if (!userProfile || userProfile.role !== 'super-admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Refusé</h1>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
          </p>
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au tableau de bord
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* EN-TÊTE SUPER ADMIN - Style AdminDashboard */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Titre Super Admin */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Super Admin Panel C.A.S.T.</h1>
              </div>
            </div>
            
            {/* Informations utilisateur */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600">Connecté en tant que</p>
                <p className="text-sm font-semibold text-gray-900">
                  {userProfile?.displayName || 'Super Administrateur'}
                </p>
              </div>
              
              {/* Badge Super Admin */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-yellow-500 px-3 py-1 rounded-lg">
                <span className="text-white">👑</span>
                <span className="text-sm font-medium text-white uppercase">
                  SUPER ADMIN
                </span>
              </div>

              {/* Bouton Déconnexion */}
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
              >
                <span className="mr-2">🚪</span>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;