#!/bin/bash

echo "� Correction des erreurs..."

# 1. Créer AdminDashboard
mkdir -p src/pages/dashboard/admin
cat > src/pages/dashboard/admin/AdminDashboard.jsx << 'ADMIN_EOF'
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const AdminDashboard = () => {
  const { userProfile, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          </div>
          <p className="text-lg mb-4">Bienvenue, administrateur <strong>{userProfile?.displayName}</strong>!</p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p>Interface d'administration en cours de développement...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
ADMIN_EOF
echo "✅ AdminDashboard.jsx créé"

# 2. Option: Créer useAuthorization OU modifier Header.jsx
# Je choisis de modifier Header.jsx pour utiliser useAuth directement
cat > src/components/layout/Header.jsx << 'HEADER_EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">C.A.S.T. Cantoria</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                  Tableau de bord
                </Link>
                <span className="text-gray-500">|</span>
                <span className="text-sm text-gray-600">
                  {userProfile?.displayName || currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition font-medium"
                >
                  Inscription
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
HEADER_EOF
echo "✅ Header.jsx mis à jour"

echo ""
echo "� Corrections appliquées !"
echo "� Fichiers corrigés:"
echo "   - src/pages/dashboard/admin/AdminDashboard.jsx"
echo "   - src/components/layout/Header.jsx"
echo ""
echo "� Redémarrez le serveur: npm run dev"
