import React from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Aide</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-medium text-gray-900">
            Comment pouvons-nous vous aider ?
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Consultez nos ressources d'aide ou contactez-nous pour toute question.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                FAQ
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link to="/faq" className="text-blue-600 hover:text-blue-800">
                  Consultez notre FAQ
                </Link>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Support
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link to="/support" className="text-blue-600 hover:text-blue-800">
                  Obtenir de l'aide
                </Link>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Contact
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link to="/contact" className="text-blue-600 hover:text-blue-800">
                  Contactez-nous
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Help;