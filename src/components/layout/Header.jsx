import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { currentUser, userProfile, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirection automatique après connexion
  useEffect(() => {
    if (userProfile && isAuthenticated) {
      const timer = setTimeout(() => {
        switch (userProfile.role) {
          case 'super-admin':
          case 'admin':
            navigate('/admin');
            break;
          case 'membre':
            navigate('/dashboard');
            break;
          default:
            navigate('/');
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [userProfile, isAuthenticated, navigate]);

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

  // Fonction pour obtenir l'avatar de l'utilisateur
  const getUserAvatar = () => {
    if (currentUser?.photoURL) {
      return currentUser.photoURL;
    }
    return "/images/icone-connexion.png";
  };

  // Fonction pour obtenir l'initiale de l'utilisateur
  const getUserInitial = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.charAt(0).toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Navigation structurée avec dropdowns fusionnés
  const navigation = {
    discovery: {
      title: "🌟 Découverte",
      items: [
        { path: "/about", label: "À Propos", icon: "ℹ️" },
        { path: "/repertoire", label: "Répertoire", icon: "📜" },
        { path: "/gallery", label: "Galerie", icon: "🖼️" },
        { path: "/join", label: "Nous Rejoindre", icon: "👥" },
        { path: "/contact", label: "Contact & Infos", icon: "📞" }
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
        
        {/* DROPDOWN DÉCOUVERTE (fusionné avec Nous Contacter) */}
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
                className={item.path === '/join' ? 'join-dropdown-item' : ''}
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

        {/* Séparateur visuel */}
        <div className="nav-divider"></div>

        {/* État de connexion - SIMPLIFIÉ AVEC JUSTE DÉCONNEXION */}
        {isAuthenticated ? (
          // Utilisateur connecté - Bouton déconnexion simple
          <button
            onClick={handleLogout}
            className="logout-btn-header"
          >
            <span>🚪</span> Déconnexion
          </button>
        ) : (
          // Utilisateur non connecté - Lien connexion simple
          <a href="/login" onClick={(e) => { e.preventDefault(); navigateTo('/login'); }} className="login-link-header">
            <span>👤</span> Connexion
          </a>
        )}
      </nav>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
    </header>
  );
};

export default Header;