// src/auth/Profile.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-cast-green mb-6">
            Mon Profil
          </h1>
          
          {user ? (
            <div className="space-y-6">
              <div className="bg-cast-green text-white p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Informations du compte</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-80">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Rôle</p>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">UID</p>
                    <p className="font-medium text-sm">{user.uid}</p>
                  </div>
                </div>
              </div>

              {/* Actions selon le rôle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(user.role === 'admin' || user.role === 'super-admin') && (
                  <Link
                    to="/admin"
                    className="bg-cast-gold text-cast-green p-4 rounded-lg text-center font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    📊 Tableau de Bord Admin
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white p-4 rounded-lg text-center font-semibold hover:bg-red-700 transition-colors"
                >
                  🚪 Déconnexion
                </button>
              </div>

              {/* Debug info */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Informations de débogage :</h3>
                <pre className="text-xs bg-black text-green-400 p-3 rounded overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Vous n'êtes pas connecté</p>
              <Link
                to="/login"
                className="bg-cast-green text-white px-6 py-3 rounded-lg hover:bg-cast-gold transition-colors"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;