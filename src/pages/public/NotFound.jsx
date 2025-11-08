import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
          {/* Illustration et code d'erreur */}
          <div className="mb-6">
            <div className="text-8xl mb-4">🔍</div>
            <h1 className="text-7xl font-bold text-gray-300 mb-2">404</h1>
          </div>
          
          {/* Message principal */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Page Non Trouvée
            </h2>
            <p className="text-gray-600 leading-relaxed">
              La page que vous recherchez n'existe pas, a été déplacée ou est temporairement indisponible.
            </p>
          </div>
          
          {/* Boutons de navigation */}
          <div className="space-y-4 mb-6">
            <Link 
              to="/" 
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🏠 Retour à l'Accueil
            </Link>
            
            <Link 
              to="/dashboard" 
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              📊 Aller au Dashboard
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="block w-full bg-gray-200 text-gray-800 py-4 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              ↩️ Retour en arrière
            </button>
          </div>
          
          {/* Informations de débogage */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              <strong>URL actuelle :</strong>
            </p>
            <code className="bg-gray-100 px-3 py-2 rounded-lg text-gray-700 text-xs font-mono break-all">
              {window.location.href}
            </code>
          </div>

          {/* Lien de support */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Besoin d'aide ?{' '}
              <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                Contactez notre support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;