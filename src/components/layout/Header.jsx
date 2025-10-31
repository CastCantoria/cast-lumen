import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getRoleIcon = () => {
    switch(userProfile?.role) {
      case 'super-admin': return '👑';
      case 'admin': return '⚙️';
      case 'member': return '🎵';
      default: return '👤';
    }
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo et Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {/* Logo image */}
              <img 
                src="/images/logo-cantoria.png" 
                alt="C.A.S.T. Cantoria" 
                className="h-10 w-auto"
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <span className="text-xl font-bold text-white font-serif">C.A.S.T.</span>
                <span className="text-xl font-bold text-blue-400 font-serif ml-1">Cantoria</span>
              </div>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium transition ${
              location.pathname === '/' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'
            }`}>
              Accueil
            </Link>
            <Link to="/about" className={`font-medium transition ${
              location.pathname === '/about' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'
            }`}>
              Notre Histoire
            </Link>
            <Link to="/repertoire" className={`font-medium transition ${
              location.pathname === '/repertoire' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'
            }`}>
              Répertoire
            </Link>
            <Link to="/events" className={`font-medium transition ${
              location.pathname === '/events' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'
            }`}>
              Événements
            </Link>
            <Link to="/gallery" className={`font-medium transition ${
              location.pathname === '/gallery' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'
            }`}>
              Galerie
            </Link>
          </nav>

          {/* Section Utilisateur */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition font-medium hidden md:flex items-center space-x-2">
                  <span>{getRoleIcon()}</span>
                  <span>Tableau de bord</span>
                </Link>

                <div className="flex items-center space-x-3">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-medium text-white">{userProfile?.displayName || currentUser.email}</div>
                    <div className="text-xs text-gray-400 capitalize">{userProfile?.role}</div>
                  </div>
                  
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(userProfile?.displayName || currentUser.email).charAt(0).toUpperCase()}
                  </div>

                  <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition">
                    Déco
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition">Connexion</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium">Inscription</Link>
              </>
            )}

            <button className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800" onClick={toggleMenu}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700 bg-gray-800">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition" onClick={closeMenu}>Accueil</Link>
              <Link to="/about" className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition" onClick={closeMenu}>Notre Histoire</Link>
              <Link to="/repertoire" className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition" onClick={closeMenu}>Répertoire</Link>
              <Link to="/events" className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition" onClick={closeMenu}>Événements</Link>
              <Link to="/gallery" className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition" onClick={closeMenu}>Galerie</Link>
              {currentUser && (
                <div className="border-t border-gray-700 my-2 pt-2">
                  <Link to="/dashboard" className="px-3 py-2 bg-blue-600 text-white rounded font-medium flex items-center space-x-2" onClick={closeMenu}>
                    <span>{getRoleIcon()}</span>
                    <span>Tableau de bord</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;