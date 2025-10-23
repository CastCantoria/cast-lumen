import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { isSuperAdmin, isAdmin, isMember, currentRole } = useAuthorization();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fermer le menu quand on change de page
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Obtenir le dashboard selon le rôle
  const getDashboardPath = () => {
    if (isSuperAdmin) return '/super-admin';
    if (isAdmin) return '/admin';
    if (isMember) return '/member';
    return '/dashboard';
  };

  // Obtenir le label du dashboard selon le rôle
  const getDashboardLabel = () => {
    if (isSuperAdmin) return 'Super-Admin';
    if (isAdmin) return 'Admin';
    if (isMember) return 'Membre';
    return 'Dashboard';
  };

  // Obtenir l'icône du dashboard selon le rôle
  const getDashboardIcon = () => {
    if (isSuperAdmin) return '👑';
    if (isAdmin) return '⚙️';
    if (isMember) return '⭐';
    return '📊';
  };

  // Obtenir le label du rôle pour l'affichage
  const getRoleLabel = () => {
    if (isSuperAdmin) return 'Super-Admin';
    if (isAdmin) return 'Administrateur';
    if (isMember) return 'Membre';
    return 'Visiteur';
  };

  return (
    <header className="sacred-header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-brand" onClick={() => navigate('/')}>
          <div className="logo-container">
            <img 
              src="/images/logo-cantoria.png" 
              alt="C.A.S.T. Cantoria" 
              className="logo-image"
            />
          </div>
          <div className="brand-text">
            <h1>C.A.S.T.</h1>
            <p>Chœur Artistique & Spirituel de Tana</p>
          </div>
        </div>

        {/* Navigation Desktop */}
        <nav className="sacred-navigation">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Accueil
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            À Propos
          </Link>
          <Link to="/events" className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}>
            Événements
          </Link>
          <Link to="/gallery" className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`}>
            Galerie
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            Contact
          </Link>
        </nav>

        {/* Section Utilisateur Desktop */}
        <div className="user-section">
          {isAuthenticated ? (
            <div className="user-info-desktop">
              <span className="user-greeting">
                Bonjour, {currentUser?.displayName || 'Utilisateur'}
              </span>
              <span className="user-role-badge">
                {getRoleLabel()}
              </span>
              <Link to={getDashboardPath()} className="btn btn-primary">
                {getDashboardLabel()}
              </Link>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/join" className="btn btn-secondary">
                Nous Rejoindre
              </Link>
              <Link to="/login" className="btn btn-primary">
                Connexion
              </Link>
            </div>
          )}
        </div>

        {/* Menu Burger */}
        <button 
          className="menu-burger"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Menu Mobile */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <nav className="mobile-nav">
          <Link to="/" className="mobile-nav-item" onClick={closeMenu}>
            <span>🏠</span>
            <span>Accueil</span>
          </Link>

          <Link to="/about" className="mobile-nav-item" onClick={closeMenu}>
            <span>🌟</span>
            <span>À Propos</span>
          </Link>

          <Link to="/events" className="mobile-nav-item" onClick={closeMenu}>
            <span>🎵</span>
            <span>Événements</span>
          </Link>

          <Link to="/gallery" className="mobile-nav-item" onClick={closeMenu}>
            <span>🖼️</span>
            <span>Galerie</span>
          </Link>

          <Link to="/contact" className="mobile-nav-item" onClick={closeMenu}>
            <span>📞</span>
            <span>Contact</span>
          </Link>

          <div className="mobile-divider"></div>

          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} className="mobile-nav-item dashboard-item" onClick={closeMenu}>
                <span>{getDashboardIcon()}</span>
                <span>{getDashboardLabel()}</span>
              </Link>
              <Link to="/profile" className="mobile-nav-item" onClick={closeMenu}>
                <span>👤</span>
                <span>Profil</span>
              </Link>
              <div className="mobile-nav-item" style={{ opacity: 0.7, fontStyle: 'italic' }}>
                <span>🎭</span>
                <span>Connecté en tant que {getRoleLabel()}</span>
              </div>
              <button onClick={handleLogout} className="mobile-nav-item logout-item">
                <span>🚪</span>
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/join" className="mobile-nav-item" onClick={closeMenu}>
                <span>👥</span>
                <span>Nous Rejoindre</span>
              </Link>
              <Link to="/login" className="mobile-nav-item" onClick={closeMenu}>
                <span>🔐</span>
                <span>Connexion</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
    </header>
  );
};

export default Header;