// src/pages/public/InscriptionPending.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const InscriptionPending = () => {
  const location = useLocation();
  const message = location.state?.message || 'Votre inscription est en cours de traitement.';

  return (
    <div className="min-h-screen bg-gradient-to-br from-cast-green to-cast-gold flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 bg-yellow-100 rounded-full">
          <span className="text-2xl">⏳</span>
        </div>
        
        <h2 className="text-2xl font-extrabold text-gray-900">
          Inscription en attente
        </h2>
        
        <p className="text-gray-600">
          {message}
        </p>
        
        <p className="text-sm text-gray-500">
          Vous recevrez un email de confirmation une fois votre inscription validée par un administrateur.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cast-green hover:bg-cast-gold hover:text-cast-green transition-all"
          >
            Retour à l'accueil
          </Link>
          
          <Link
            to="/contact"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InscriptionPending;