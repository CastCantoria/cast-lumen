import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthorization } from '../hooks/useAuthorization';

const Unauthorized = () => {
  const { currentRole, isAuthenticated } = useAuthorization();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icône */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Titre et message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Accès Non Autorisé
        </h1>
        
        <p className="text-gray-600 mb-2">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        {/* Informations sur le rôle */}
        {isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Rôle actuel:</strong> <span className="capitalize">{currentRole?.replace('-', ' ')}</span>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Contactez un administrateur si vous pensez avoir besoin d'accéder à cette ressource.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition block font-medium"
          >
            🏠 Retour à l'accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition block font-medium"
          >
            ↩️ Retour en arrière
          </button>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition block font-medium"
            >
              🔐 Se connecter
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition block font-medium"
            >
              📊 Mon Dashboard
            </Link>
          )}
        </div>

        {/* Message d'assistance */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Besoin d'aide ? Contactez l'équipe technique à{' '}
            <a href="mailto:support@cast-tana.org" className="text-blue-600 hover:underline">
              support@cast-tana.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;