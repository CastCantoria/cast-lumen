import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getRoleDescription = () => {
    switch(user.role) {
      case 'super-admin':
        return 'Vous avez un accès complet à toutes les fonctionnalités';
      case 'admin':
        return 'Vous pouvez gérer les membres et le contenu';
      case 'member':
        return 'Vous pouvez ajouter des médias et partitions';
      case 'contributor':
        return 'Vous pouvez contribuer au contenu';
      default:
        return 'Bienvenue dans votre espace';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-100 py-8">
      <div className="container mx-auto px-4">
        {/* En-tête de bienvenue */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center space-x-6">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-full border-4 border-yellow-500"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center border-4 border-white">
                  <span className="text-white text-2xl font-bold">
                    {user.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-green-800 mb-2">
                  {getWelcomeMessage()}, {user.firstName || 'cher membre'} !
                </h1>
                <p className="text-lg text-gray-600 mb-3">
                  {getRoleDescription()}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="bg-yellow-500 text-green-900 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {user.role}
                  </span>
                  <span className="text-sm text-gray-500">
                    Connecté depuis {user.createdAt?.toDate?.().toLocaleDateString('fr-FR') || 'aujourd\'hui'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cartes d'actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Profil */}
            <Link 
              to="/profile" 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-600 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500 transition-colors">
                  <span className="text-2xl text-white">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Mon Profil</h3>
                <p className="text-gray-600 text-sm">
                  Gérer mes informations personnelles et mes préférences
                </p>
              </div>
            </Link>

            {/* Médias */}
            {(user.role === 'member' || user.role === 'contributor' || user.role === 'admin' || user.role === 'super-admin') && (
              <Link 
                to="/gallery" 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-600 group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500 transition-colors">
                    <span className="text-2xl text-white">📁</span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Galerie Médias</h3>
                  <p className="text-gray-600 text-sm">
                    Partager des partitions PDF et des photos avec la communauté
                  </p>
                </div>
              </Link>
            )}

            {/* Administration */}
            {(user.role === 'admin' || user.role === 'super-admin') && (
              <Link 
                to="/admin" 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-600 group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500 transition-colors">
                    <span className="text-2xl text-white">⚙️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Administration</h3>
                  <p className="text-gray-600 text-sm">
                    Gérer les utilisateurs, le contenu et les paramètres du site
                  </p>
                </div>
              </Link>
            )}

            {/* Galerie */}
            <Link 
              to="/gallery" 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-600 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500 transition-colors">
                  <span className="text-2xl text-white">🖼️</span>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Galerie</h3>
                <p className="text-gray-600 text-sm">
                  Découvrir les photos, vidéos et partitions de la chorale
                </p>
              </div>
            </Link>

            {/* Événements */}
            <Link 
              to="/events" 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-600 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500 transition-colors">
                  <span className="text-2xl text-white">🎵</span>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Concerts</h3>
                <p className="text-gray-600 text-sm">
                  Voir les prochains événements et concerts de la chorale
                </p>
              </div>
            </Link>

            {/* Blog */}
            <Link 
              to="/blog" 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-600 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500 transition-colors">
                  <span className="text-2xl text-white">✍️</span>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Blog</h3>
                <p className="text-gray-600 text-sm">
                  Lire les actualités et articles de la chorale
                </p>
              </div>
            </Link>
          </div>

          {/* Statistiques rapides */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Aperçu de votre activité</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-800">1</div>
                <div className="text-sm text-gray-600">Profil complet</div>
              </div>
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-800">0</div>
                <div className="text-sm text-gray-600">Médias partagés</div>
              </div>
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-800">{user.role === 'super-admin' ? 'Complet' : 'Standard'}</div>
                <div className="text-sm text-gray-600">Niveau d'accès</div>
              </div>
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-800">Membre</div>
                <div className="text-sm text-gray-600">Statut</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;