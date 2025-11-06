// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      window.location.href = '/';
    }
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const menuItems = [
    {
      label: "La Chorale",
      items: [
        { to: "/about", label: "Notre Histoire" },
        { to: "/spiritualite", label: "Spiritualité" },
        { to: "/join", label: "Nous Rejoindre" },
        { to: "/contact", label: "Contact" }
      ]
    },
    {
      label: "Activités",
      items: [
        { to: "/repertoire", label: "Répertoire" },
        { to: "/events", label: "Événements" },
        { to: "/gallery", label: "Galerie" },
        { to: "/concerts", label: "Concerts" }
      ]
    }
  ];

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6">
        
        {/* BARRE PRINCIPALE */}
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO C.A.S.T. */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3" onClick={closeAllMenus}>
              <div className="flex items-center justify-center">
                <img 
                  src="/images/logo-cantoria.png" 
                  alt="C.A.S.T. Cantoria" 
                  className="h-10 w-auto"
                  onError={(e) => {
                    // Fallback si le logo ne charge pas
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback visuel */}
                <div 
                  className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ display: 'none' }}
                >
                  🎵
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-white font-serif leading-tight">C.A.S.T.</div>
                <div className="text-lg font-bold text-blue-400 font-serif leading-tight">Cantoria</div>
              </div>
              <div className="sm:hidden text-lg font-bold text-white font-serif">
                CAST
              </div>
            </Link>
          </div>

          {/* NAVIGATION DESKTOP */}
          <nav className="hidden lg:flex items-center space-x-1 mx-8">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                location.pathname === '/' 
                  ? 'text-blue-400 bg-gray-800 shadow-inner' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
              onClick={closeAllMenus}
            >
              Accueil
            </Link>
            
            {/* GROUPES EN DROPDOWN */}
            {menuItems.map((menu) => (
              <div key={menu.label} className="relative group">
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 whitespace-nowrap ${
                    menu.items.some(item => location.pathname === item.to) 
                      ? 'text-blue-400 bg-gray-800 shadow-inner' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{menu.label}</span>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* DROPDOWN MENU */}
                <div className="absolute left-0 mt-1 w-56 rounded-lg shadow-xl bg-gray-800 border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {menu.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`block px-4 py-2 text-sm whitespace-nowrap mx-2 rounded ${
                          location.pathname === item.to
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                        onClick={closeAllMenus}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* BOUTONS ACTION ET PROFIL */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            
            {/* BOUTON CHAT - Desktop */}
            {currentUser && (
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  to="/chat" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg group whitespace-nowrap"
                  onClick={closeAllMenus}
                >
                  <span className="text-lg">💬</span>
                  <span className="font-medium">Chat Live</span>
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                </Link>

                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg group whitespace-nowrap"
                  onClick={closeAllMenus}
                >
                  <span className="text-lg">📊</span>
                  <span className="font-medium">Espace</span>
                </Link>
              </div>
            )}

            {/* BOUTON CHAT MOBILE */}
            {currentUser && (
              <Link 
                to="/chat" 
                className="md:hidden flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors relative"
                title="Chat Live"
                onClick={closeAllMenus}
              >
                <span className="text-lg">💬</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              </Link>
            )}

            {/* PROFIL UTILISATEUR */}
            {currentUser ? (
              <div className="flex items-center space-x-3">
                {/* Version Desktop */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right min-w-0 max-w-[120px]">
                    <div className="text-sm font-medium text-white truncate">
                      {userProfile?.displayName || currentUser.email}
                    </div>
                    <div className="text-xs text-gray-400 capitalize truncate">
                      {userProfile?.role}
                    </div>
                  </div>
                  
                  {/* MENU UTILISATEUR DROPDOWN */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors border border-gray-700"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        userProfile?.role === 'admin' ? 'bg-red-500' : 
                        userProfile?.role === 'super-admin' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`}>
                        {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </button>

                    {/* DROPDOWN MENU UTILISATEUR */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-xl border border-gray-700 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              userProfile?.role === 'admin' ? 'bg-red-500' : 
                              userProfile?.role === 'super-admin' ? 'bg-purple-500' :
                              'bg-blue-500'
                            }`}>
                              {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white truncate text-sm">
                                {userProfile?.displayName || 'Utilisateur'}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {userProfile?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="px-2 py-2 space-y-1">
                          <Link 
                            to="/dashboard" 
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors group"
                            onClick={closeAllMenus}
                          >
                            <span className="text-lg">📊</span>
                            <div className="flex-1">
                              <div className="font-medium text-white text-sm">Tableau de Bord</div>
                            </div>
                          </Link>

                          <Link 
                            to="/chat" 
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors group"
                            onClick={closeAllMenus}
                          >
                            <span className="text-lg">💬</span>
                            <div className="flex-1">
                              <div className="font-medium text-white text-sm">Chat Communautaire</div>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          </Link>

                          <Link 
                            to="/profile" 
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors group"
                            onClick={closeAllMenus}
                          >
                            <span className="text-lg">👤</span>
                            <div className="flex-1">
                              <div className="font-medium text-white text-sm">Mon Profil</div>
                            </div>
                          </Link>
                        </div>

                        <div className="px-2 py-2 border-t border-gray-700">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-900 transition-colors group w-full text-left"
                          >
                            <span className="text-lg">🚪</span>
                            <div>
                              <div className="font-medium text-red-400 text-sm">Se déconnecter</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Version Mobile */}
                <div className="md:hidden flex items-center space-x-2">
                  <div className="text-right min-w-0 max-w-[80px]">
                    <div className="text-xs font-medium text-white truncate">
                      {userProfile?.displayName || currentUser.email?.split('@')[0]}
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-600 text-white p-2 rounded text-sm hover:bg-red-700 transition flex items-center"
                    title="Déconnexion"
                  >
                    <span>🚪</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Boutons connexion */
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white font-medium transition whitespace-nowrap px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* MENU BURGER MOBILE */}
            <button 
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* MENU MOBILE - ALIGNÉ À GAUCHE */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 bg-gray-800 py-4">
            <nav className="flex flex-col space-y-3">
              {/* Accueil */}
              <Link 
                to="/" 
                className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                onClick={closeAllMenus}
              >
                <span className="text-lg mr-3">🏠</span>
                <span className="font-medium">Accueil</span>
              </Link>
              
              {/* GROUPES EN DROPDOWN - MOBILE */}
              {menuItems.map((menu) => (
                <div key={menu.label} className="space-y-2">
                  {/* En-tête du menu */}
                  <div className="flex items-center px-4 py-3 text-gray-300 bg-gray-750">
                    <span className="text-lg mr-3">📂</span>
                    <span className="font-medium">{menu.label}</span>
                  </div>
                  
                  {/* Sous-items */}
                  <div className="space-y-1">
                    {menu.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center px-6 py-2 text-sm transition-colors ${
                          location.pathname === item.to
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                        onClick={closeAllMenus}
                      >
                        <span className="mr-3">•</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Espace Membre */}
              {currentUser && (
                <>
                  <div className="border-t border-gray-700 pt-4 mt-2">
                    {/* Tableau de Bord */}
                    <Link 
                      to="/dashboard" 
                      className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      onClick={closeAllMenus}
                    >
                      <span className="text-lg mr-3">📊</span>
                      <span className="font-medium">Tableau de Bord</span>
                    </Link>
                    
                    {/* Chat Live */}
                    <Link 
                      to="/chat" 
                      className="flex items-center px-4 py-3 text-green-300 hover:text-white hover:bg-green-900 transition-colors"
                      onClick={closeAllMenus}
                    >
                      <span className="text-lg mr-3">💬</span>
                      <span className="font-medium">Chat Live</span>
                      <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </Link>
                  </div>
                  
                  {/* Déconnexion */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 text-red-400 hover:text-white hover:bg-red-900 transition-colors mt-2 w-full text-left"
                  >
                    <span className="text-lg mr-3">🚪</span>
                    <span className="font-medium">Se déconnecter</span>
                  </button>
                </>
              )}

              {/* Connexion/Inscription */}
              {!currentUser && (
                <div className="border-t border-gray-700 pt-4 mt-2 space-y-3">
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={closeAllMenus}
                  >
                    <span className="text-lg mr-3">🔑</span>
                    <span className="font-medium">Connexion</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-4"
                    onClick={closeAllMenus}
                  >
                    <span className="text-lg mr-3">📝</span>
                    <span className="font-medium">S'inscrire</span>
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