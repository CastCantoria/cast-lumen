import React from 'react';
import { Link } from 'react-router-dom';

const Support = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Support</h1>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Besoin d'aide ?</h2>
          <div className="mt-5">
            <div className="rounded-md bg-gray-50 px-6 py-5">
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Support technique
                  </p>
                  <p className="text-sm text-gray-500">
                    Pour toute question technique ou problème d'accès
                  </p>
                </div>
                <div className="ml-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Contacter le support
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Ressources utiles
              </h3>
              <div className="mt-2 border-t border-gray-200 divide-y divide-gray-200">
                <div className="py-4">
                  <Link
                    to="/faq"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    FAQ - Questions fréquentes
                  </Link>
                </div>
                <div className="py-4">
                  <Link
                    to="/help"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Guide d'utilisation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;