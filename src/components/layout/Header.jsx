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
      // La redirection est maintenant gérée dans AuthContext
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      // 🔥 REDIRECTION DE SECOURS
      window.location.href = '/login';
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

  const getRoleIcon = () => {
    switch(userProfile?.role) {
      case 'super-admin': return '👑';
      case 'admin': return '⚙️';
      case 'member': return '🎵';
      default: return '👤';
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo et Brand */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMenu}>
            <div className="flex items-center space-x-2">
              <img 
                src="/images/logo-cantoria.png" 
                alt="C.A.S.T. Cantoria" 
                className="h-10 w-auto"
                onError={(e) => {
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
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`font-medium transition ${
              location.pathname === '/' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'
            }`}>
              Accueil
            </Link>
            
            {menuItems.map((menu) => (
              (!menu.authRequired || currentUser) && (
                <div key={menu.label} className="relative group">
                  <button
                    className={`font-medium transition flex items-center space-x-1 ${
                      menu.items.some(item => location.pathname === item.to) ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => toggleSubmenu(menu.label)}
                  >
                    <span>{menu.label}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {menu.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`block px-4 py-2 text-sm ${
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

          {/* Section Utilisateur */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{userProfile?.displayName || currentUser.email}</div>
                    <div className="text-xs text-gray-400 capitalize">{userProfile?.role}</div>
                  </div>
                  
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(userProfile?.displayName || currentUser.email).charAt(0).toUpperCase()}
                  </div>

                  {/* 🔥 BOUTON DÉCONNEXION AMÉLIORÉ */}
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition flex items-center gap-1"
                  >
                    <span>🚪</span>
                    <span>Déco</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition">Connexion</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium">Inscription</Link>
              </div>
            )}

            {/* Menu Mobile Toggle */}
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
            <nav className="flex flex-col space-y-1">
              <Link to="/" className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition" onClick={closeMenu}>
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
                  {/* 🔥 BOUTON DÉCONNEXION MOBILE AMÉLIORÉ */}
                  <button 
                    onClick={handleLogout} 
                    className="w-full mt-2 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <span>🚪</span>
                    <span>Déconnexion</span>
                  </button>
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