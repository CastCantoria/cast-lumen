// src/components/ui/UnderConstruction.jsx
import React from 'react';

const UnderConstruction = ({ pageName }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Page en construction
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {pageName ? `La page "${pageName}" est en cours de construction.` : 'Cette page est en cours de construction.'}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Nous travaillons activement sur cette fonctionnalité. 
              Revenez bientôt pour découvrir les nouveautés !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;