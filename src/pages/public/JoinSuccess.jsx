import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const JoinSuccess = () => {
  const location = useLocation();
  const { firstName, role, applicationId, email } = location.state || {};

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'choriste': 'choriste',
      'benevole': 'bénévole',
      'musicien': 'musicien instrumentiste',
      'technique': 'technicien',
      'communication': 'responsable communication',
      'autre': 'membre'
    };
    return roleNames[role] || 'membre';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          <div className="text-6xl mb-4 sm:mb-6">🎉</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Félicitations {firstName || ''} !
          </h1>
          
          {applicationId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
              <p className="text-blue-800 text-sm sm:text-base">
                <strong>Référence :</strong> {applicationId}
              </p>
            </div>
          )}
          
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Votre demande d'adhésion en tant que <strong>{getRoleDisplayName(role)}</strong> a bien été reçue.
            {email && (
              <span className="block mt-2">
                Un email de confirmation a été envoyé à <strong>{email}</strong>
              </span>
            )}
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Prochaines étapes :</h3>
            <ul className="text-green-700 text-xs sm:text-sm text-left space-y-1">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Notre équpe examine votre demande sous 7 jours</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Contact pour entretien ou audition</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Réponse définitive sous 15 jours</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Intégration lors de la prochaine répétition</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link 
              to="/"
              className="block w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
            >
              Retour à l'accueil
            </Link>
            <Link 
              to="/contact"
              className="block w-full border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition text-sm sm:text-base"
            >
              Nous contacter
            </Link>
            <Link 
              to="/events"
              className="block w-full border border-green-300 text-green-700 py-2.5 sm:py-3 px-4 rounded-lg hover:border-green-600 hover:text-green-600 transition text-sm sm:text-base"
            >
              Voir nos événements
            </Link>
          </div>

          <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
            <p>Vous avez des questions ? Contactez-nous à <strong>contact@castcantoria.org</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinSuccess;