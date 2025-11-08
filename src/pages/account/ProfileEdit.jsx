import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileEdit = () => {
  const { userProfile } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifier mon profil</h1>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  defaultValue={userProfile?.displayName}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  defaultValue={userProfile?.email}
                />
              </div>
            </div>

            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div className="mt-2 flex items-center">
                <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={userProfile?.photoURL || "https://via.placeholder.com/200"} 
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </span>
                <button
                  type="button"
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Changer
                </button>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;