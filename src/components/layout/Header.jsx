// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState('');

  // 🔥 FONCTION DE DÉCONNEXION AMÉLIORÉE
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      // 🔥 REDIRECTION DE SECOURS
      window.location.href = '/';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubmenu = (menu) => {
    setIsSubmenuOpen(isSubmenuOpen === menu ? '' : menu);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsSubmenuOpen('');
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
    },
    {
      label: "Espace Membre",
      authRequired: true,
      items: [
        { to: "/profile", label: "Mon Profil" },
        { to: "/dashboard", label: "Tableau de bord" },
        { to: "/partitions", label: "Partitions" },
        { to: "/repetitions", label: "Répétitions" }
      ]
    }
  ];

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-3 sm:px-4 md:px-6">
        <div className="flex justify-between items-center h-16 min-w-0">
          
          {/* Logo et Brand - Version compacte */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0" onClick={closeMenu}>
            <div className="flex items-center space-x-2">
              <img 
                src="/images/logo-cantoria.png" 
                alt="C.A.S.T. Cantoria" 
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-white font-serif">C.A.S.T.</div>
                <div className="text-lg font-bold text-blue-400 font-serif">Cantoria</div>
              </div>
              <div className="sm:hidden">
                <div className="text-lg font-bold text-white font-serif">CAST</div>
              </div>
            </div>
          </Link>

          {/* Navigation Desktop - RÉTABLIE avec md:flex */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-4 xl:space-x-6 flex-1 justify-center min-w-0 mx-4">
            <Link 
              to="/" 
              className={`font-medium transition whitespace-nowrap px-2 py-1 text-sm lg:text-base ${
                location.pathname === '/' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              Accueil
            </Link>
            
            {menuItems.map((menu) => (
              (!menu.authRequired || currentUser) && (
                <div key={menu.label} className="relative group">
                  <button
                    className={`font-medium transition flex items-center space-x-1 whitespace-nowrap px-2 py-1 text-sm lg:text-base ${
                      menu.items.some(item => location.pathname === item.to) ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => toggleSubmenu(menu.label)}
                  >
                    <span>{menu.label}</span>
                    <svg className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {menu.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`block px-4 py-2 text-sm whitespace-nowrap ${
                            location.pathname === item.to
                              ? 'bg-gray-700 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                          onClick={closeMenu}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ))}
          </nav>

          {/* Section Utilisateur - Version compacte */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            {currentUser ? (
              <>
                {/* Version desktop complète */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right min-w-0 max-w-[120px] lg:max-w-[140px]">
                    <div className="text-sm font-medium text-white truncate">
                      {userProfile?.displayName || currentUser.email}
                    </div>
                    <div className="text-xs text-gray-400 capitalize truncate">
                      {userProfile?.role}
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {(userProfile?.displayName || currentUser.email).charAt(0).toUpperCase()}
                  </div>

                  {/* 🔥 BOUTON DÉCONNEXION AMÉLIORÉ */}
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                  >
                    <span>🚪</span>
                    <span>Déco</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white font-medium transition whitespace-nowrap text-sm lg:text-base"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-3 py-1 lg:px-4 lg:py-2 rounded-md hover:bg-blue-700 transition font-medium whitespace-nowrap text-sm lg:text-base"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Menu Mobile Toggle - Visible uniquement sur mobile */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 flex-shrink-0"
              onClick={toggleMenu}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Bouton déconnexion visible uniquement sur mobile quand connecté */}
            {currentUser && (
              <button 
                onClick={handleLogout} 
                className="md:hidden bg-red-600 text-white p-2 rounded text-sm hover:bg-red-700 transition flex items-center flex-shrink-0"
                title="Déconnexion"
              >
                <span>🚪</span>
              </button>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700 bg-gray-800">
            <nav className="flex flex-col space-y-1">
              <Link 
                to="/" 
                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition" 
                onClick={closeMenu}
              >
                Accueil
              </Link>
              
              {menuItems.map((menu) => (
                (!menu.authRequired || currentUser) && (
                  <div key={menu.label} className="space-y-1">
                    <button
                      className={`w-full px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 rounded transition flex items-center justify-between ${
                        isSubmenuOpen === menu.label ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => toggleSubmenu(menu.label)}
                    >
                      <span>{menu.label}</span>
                      <svg
                        className={`w-4 h-4 transform transition-transform ${
                          isSubmenuOpen === menu.label ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isSubmenuOpen === menu.label && (
                      <div className="pl-4 space-y-1">
                        {menu.items.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={`block px-3 py-2 rounded text-sm ${
                              location.pathname === item.to
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                            onClick={closeMenu}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ))}

              {currentUser && (
                <div className="border-t border-gray-700 mt-2 pt-2">
                  <div className="px-3 py-2">
                    <div className="text-sm text-gray-300">{userProfile?.displayName || currentUser.email}</div>
                    <div className="text-xs text-gray-400 capitalize">{userProfile?.role}</div>
                  </div>
                </div>
              )}

              {!currentUser && (
                <div className="border-t border-gray-700 mt-2 pt-2 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition"
                    onClick={closeMenu}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={closeMenu}
                  >
                    Inscription
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