import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const JoinSuccess = () => {
  const location = useLocation();
  const { firstName, role } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Félicitations {firstName || ''} !
          </h1>
          <p className="text-gray-600 mb-6">
            Votre demande d'adhésion en tant que <strong>{role === 'choriste' ? 'choriste' : 'bénévole'}</strong> a bien été reçue.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Prochaines étapes :</h3>
            <ul className="text-green-700 text-sm text-left space-y-1">
              <li>• Notre équipe va examiner votre demande</li>
              <li>• Vous serez contacté(e) sous 48h</li>
              <li>• Une rencontre sera organisée</li>
              <li>• Début des activités selon le calendrier</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link 
              to="/"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Retour à l'accueil
            </Link>
            <Link 
              to="/contact"
              className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinSuccess;