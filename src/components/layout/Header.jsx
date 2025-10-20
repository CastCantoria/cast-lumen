// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const goToHome = () => {
    navigate('/');
    closeMenu();
  };

  const navigateTo = (path) => {
    navigate(path);
    closeMenu();
  };

  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fonction pour obtenir l'initiale de l'utilisateur
  const getUserInitial = () => {
    if (currentUser?.firstName) {
      return currentUser.firstName.charAt(0).toUpperCase();
    }
    if (currentUser?.displayName) {
      return currentUser.displayName.charAt(0).toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Fonction pour obtenir le nom d'affichage
  const getDisplayName = () => {
    if (currentUser?.firstName) {
      return currentUser.firstName;
    }
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    return currentUser?.email || 'Utilisateur';
  };

  // Navigation structurée avec dropdowns
  const navigation = {
    discovery: {
      title: "🌟 Découverte",
      items: [
        { path: "/about", label: "À Propos", icon: "ℹ️" },
        { path: "/repertoire", label: "Répertoire", icon: "📜" },
        { path: "/gallery", label: "Galerie", icon: "🖼️" }
      ]
    },
    activities: {
      title: "🎭 Activités", 
      items: [
        { path: "/events", label: "Concerts", icon: "🎵" },
        { path: "/blog", label: "Blog", icon: "📰" },
        { path: "/spirituality", label: "Spiritualité", icon: "🙏" }
      ]
    }
  };

  return (
    <header className="sacred-header">
      <div className="header-brand">
        <div className="logo-container" onClick={goToHome}>
          <img 
            src="/images/logo-cantoria.png" 
            alt="C.A.S.T. Cantoria" 
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="logo-fallback">
            🎵
          </div>
        </div>
        <div className="brand-text" onClick={goToHome}>
          <h1>𝕮.𝕬.𝕾.𝕿.</h1>
          <p className="gothic-unicode">𝕮𝖍𝖔𝖊𝖚𝖗 𝕬𝖗𝖙𝖎𝖘𝖎𝖙𝖎𝖖𝖚𝖊 & 𝕾𝖕𝖎𝖗𝖎𝖙𝖚𝖊𝖑 𝖉𝖊 𝕿𝖆𝖓𝖆</p>
        </div>
      </div>

      <button 
        className={`menu-burger-music ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span className="music-icon closed">🎵</span>
        <span className="music-icon open">🎶</span>
      </button>

      <nav 
        className={`sacred-navigation ${isMenuOpen ? 'active' : ''}`}
        onClick={closeDropdowns}
      >
        {/* Navigation principale */}
        <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
          <span>🏠</span> Accueil
        </a>
        
        {/* DROPDOWN DÉCOUVERTE */}
        <div className="nav-dropdown">
          <button 
            className={`dropdown-toggle ${activeDropdown === 'discovery' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('discovery');
            }}
          >
            <span>🌟</span> Découverte
            <span className="dropdown-arrow">▼</span>
          </button>
          <div className={`dropdown-menu ${activeDropdown === 'discovery' ? 'active' : ''}`}>
            {navigation.discovery.items.map((item) => (
              <a 
                key={item.path} 
                href={item.path} 
                onClick={(e) => { e.preventDefault(); navigateTo(item.path); }}
              >
                <span>{item.icon}</span> {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* DROPDOWN ACTIVITÉS */}
        <div className="nav-dropdown">
          <button 
            className={`dropdown-toggle ${activeDropdown === 'activities' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('activities');
            }}
          >
            <span>🎭</span> Activités
            <span className="dropdown-arrow">▼</span>
          </button>
          <div className={`dropdown-menu ${activeDropdown === 'activities' ? 'active' : ''}`}>
            {navigation.activities.items.map((item) => (
              <a 
                key={item.path} 
                href={item.path} 
                onClick={(e) => { e.preventDefault(); navigateTo(item.path); }}
              >
                <span>{item.icon}</span> {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bouton Nous Rejoindre */}
        <a href="/join" onClick={(e) => { e.preventDefault(); navigateTo('/join'); }} className="join-btn">
          <span>👥</span> Nous Rejoindre
        </a>

        {/* Bouton Contact */}
        <a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('/contact'); }} className="contact-btn">
          <span>📞</span> Contact
        </a>

        {/* Séparateur visuel */}
        <div className="nav-divider"></div>

        {/* État de connexion */}
        {currentUser ? (
          // Utilisateur connecté - Avatar avec dropdown
          <div className="nav-dropdown user-menu">
            <button 
              className={`dropdown-toggle user-avatar-toggle ${activeDropdown === 'user' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('user');
              }}
            >
              <div className="user-avatar">
                {getUserInitial()}
              </div>
              <span className="user-name-mobile">{getDisplayName()}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className={`dropdown-menu user-dropdown ${activeDropdown === 'user' ? 'active' : ''}`}>
              <div className="user-info">
                <strong>{getDisplayName()}</strong>
                <span>{currentUser.email}</span>
                {userRole && (
                  <span className="user-role">Rôle: {userRole}</span>
                )}
              </div>
              <div className="dropdown-divider"></div>
              <a href="/dashboard" onClick={(e) => { e.preventDefault(); navigateTo('/dashboard'); }}>
                <span>📊</span> Tableau de bord
              </a>
              <a href="/profile" onClick={(e) => { e.preventDefault(); navigateTo('/profile'); }}>
                <span>👤</span> Mon profil
              </a>
              {userRole?.startsWith('admin') && (
                <a href="/admin/dashboard" onClick={(e) => { e.preventDefault(); navigateTo('/admin/dashboard'); }}>
                  <span>⚙️</span> Administration
                </a>
              )}
              <div className="dropdown-divider"></div>
              <button 
                onClick={handleLogout}
                className="logout-btn"
              >
                <span>🚪</span> Déconnexion
              </button>
            </div>
          </div>
        ) : (
          // Utilisateur non connecté - Icône de connexion avec dropdown
          <div className="nav-dropdown login-menu">
            <button 
              className={`dropdown-toggle login-icon-toggle ${activeDropdown === 'login' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('login');
              }}
            >
              <div className="login-icon">🔐</div>
              <span className="login-text-mobile">Connexion</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className={`dropdown-menu login-dropdown ${activeDropdown === 'login' ? 'active' : ''}`}>
              <a href="/login" onClick={(e) => { e.preventDefault(); navigateTo('/login'); }}>
                <span>🔐</span> Se connecter
              </a>
              <a href="/register" onClick={(e) => { e.preventDefault(); navigateTo('/register'); }}>
                <span>📝</span> S'inscrire
              </a>
            </div>
          </div>
        )}
      </nav>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
    </header>
  );
};

export default Header;