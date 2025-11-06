// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* ==================== */}
          {/* PARTIE GAUCHE - LOGO & NAV PRINCIPALE */}
          {/* ==================== */}
          <div className="flex items-center space-x-8">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                🎵
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-900 text-lg leading-tight">C.A.S.T. Cantoria</h1>
                <p className="text-xs text-gray-500 leading-tight">Chorale Artistique Sacrée & Traditionnelle</p>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link 
                to="/" 
                className="px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
              >
                Accueil
              </Link>
              <Link 
                to="/about" 
                className="px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
              >
                La Chorale
              </Link>
              <Link 
                to="/events" 
                className="px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
              >
                Activités
              </Link>
              <Link 
                to="/repertoire" 
                className="px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
              >
                Répertoire
              </Link>
            </nav>
          </div>

          {/* ==================== */}
          {/* PARTIE CENTRE - BOUTONS ACTION */}
          {/* ==================== */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="hidden md:flex items-center justify-center space-x-3">
              
              {/* 🔥 BOUTON CHAT - Visible sur tablette+ */}
              {currentUser && (
                <Link 
                  to="/chat" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg group"
                >
                  <span className="text-lg group-hover:animate-bounce">💬</span>
                  <span className="font-medium hidden lg:inline">Chat Live</span>
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                </Link>
              )}

              {/* Bouton Dashboard - Visible sur tablette+ */}
              {currentUser && (
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg group"
                >
                  <span className="text-lg">📊</span>
                  <span className="font-medium hidden lg:inline">Mon Espace</span>
                </Link>
              )}
            </div>
          </div>

          {/* ==================== */}
          {/* PARTIE DROITE - PROFIL & MENU MOBILE */}
          {/* ==================== */}
          <div className="flex items-center space-x-3">
            
            {/* 🔥 BOUTON CHAT MOBILE - Visible uniquement mobile */}
            {currentUser && (
              <Link 
                to="/chat" 
                className="md:hidden flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors relative"
                title="Chat Live"
              >
                <span className="text-xl">💬</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
              </Link>
            )}

            {/* Menu Utilisateur */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors border border-gray-200"
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    userProfile?.role === 'admin' ? 'bg-red-500' : 
                    userProfile?.role === 'member' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {userProfile?.displayName?.charAt(0) || 'U'}
                  </div>
                  
                  {/* Infos utilisateur - caché sur mobile */}
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900 leading-tight max-w-32 truncate">
                      {userProfile?.displayName || 'Utilisateur'}
                    </div>
                    <div className="text-xs text-gray-500 leading-tight capitalize">
                      {userProfile?.vocalRange || userProfile?.role || 'user'}
                    </div>
                  </div>

                  {/* Icône flèche */}
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menu déroulant utilisateur */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* En-tête profil */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          userProfile?.role === 'admin' ? 'bg-red-500' : 
                          userProfile?.role === 'member' ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          {userProfile?.displayName?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {userProfile?.displayName || 'Utilisateur'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {userProfile?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation rapide */}
                    <div className="px-2 py-2">
                      <Link 
                        to="/dashboard" 
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">📊</span>
                        <div>
                          <div className="font-medium text-gray-900">Mon Tableau de Bord</div>
                          <div className="text-xs text-gray-500">Accéder à mon espace</div>
                        </div>
                      </Link>

                      {/* 🔥 CHAT dans le menu utilisateur */}
                      <Link 
                        to="/chat" 
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">💬</span>
                        <div>
                          <div className="font-medium text-gray-900">Chat Communautaire</div>
                          <div className="text-xs text-gray-500">Discuter avec les membres</div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-auto"></div>
                      </Link>

                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">👤</span>
                        <div>
                          <div className="font-medium text-gray-900">Mon Profil</div>
                          <div className="text-xs text-gray-500">Gérer mon compte</div>
                        </div>
                      </Link>
                    </div>

                    {/* Déconnexion */}
                    <div className="px-2 py-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors group w-full text-left"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
                        <div>
                          <div className="font-medium text-red-600">Se déconnecter</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Boutons connexion */
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Menu Burger Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>

        {/* ==================== */}
        {/* MENU MOBILE */}
        {/* ==================== */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <nav className="space-y-2">
              <Link 
                to="/" 
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Accueil
              </Link>
              <Link 
                to="/about" 
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🎵 La Chorale
              </Link>
              <Link 
                to="/events" 
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                📅 Activités
              </Link>
              <Link 
                to="/repertoire" 
                className="block px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🎼 Répertoire
              </Link>
              
              {/* 🔥 CHAT dans le menu mobile */}
              {currentUser && (
                <Link 
                  to="/chat" 
                  className="block px-4 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium text-green-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💬 Chat Communautaire
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;