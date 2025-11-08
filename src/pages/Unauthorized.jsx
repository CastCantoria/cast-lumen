import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Icône d'erreur */}
          <div className="text-6xl mb-4">🚫</div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Accès Non Autorisé
          </h1>
          
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          
          {/* Boutons de navigation */}
          <div className="space-y-3">
            <Link 
              to="/dashboard" 
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              📊 Retour au Tableau de Bord
            </Link>
            
            <Link 
              to="/" 
              className="block w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              🏠 Retour à l'Accueil
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ↩️ Retour en arrière
            </button>
          </div>
          
          {/* Informations de débogage */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">
              Rôle actuel: <strong>{localStorage.getItem('userRole') || 'Non défini'}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;