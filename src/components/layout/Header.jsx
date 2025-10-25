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
    if (isSuperAdmin) return '/app/super-admin';
    if (isAdmin) return '/app/admin';
    if (isMember) return '/app/member';
    return '/app/dashboard';
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
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo-fallback">
              🎵
            </div>
          </div>
          <div className="brand-text">
            <h1>𝕮.𝕬.𝕾.𝕿.</h1>
            <p className="gothic-unicode">𝕮𝖍𝖔𝖊𝖚𝖗 𝕬𝖗𝖙𝖎𝖘𝖎𝖙𝖎𝖖𝖚𝖊 & 𝕾𝖕𝖎𝖗𝖎𝖙𝖚𝖊𝖑 𝖉𝖊 𝕿𝖆𝖓𝖆</p>
          </div>
        </div>

        {/* Navigation Desktop */}
        <nav className="sacred-navigation">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <span>🏠</span> Accueil
          </a>
          
          {/* DROPDOWN DÉCOUVERTE */}
          <div className="nav-dropdown">
            <button className="dropdown-toggle">
              <span>🌟</span> Découverte
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className="dropdown-menu">
              <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
                <span>ℹ️</span> À Propos
              </a>
              <a href="/repertoire" onClick={(e) => { e.preventDefault(); navigate('/repertoire'); }}>
                <span>📜</span> Répertoire
              </a>
              <a href="/gallery" onClick={(e) => { e.preventDefault(); navigate('/gallery'); }}>
                <span>🖼️</span> Galerie
              </a>
              <a href="/join" onClick={(e) => { e.preventDefault(); navigate('/join'); }} className="join-dropdown-item">
                <span>👥</span> Nous Rejoindre
              </a>
            </div>
          </div>

          {/* DROPDOWN ACTIVITÉS */}
          <div className="nav-dropdown">
            <button className="dropdown-toggle">
              <span>🎭</span> Activités
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className="dropdown-menu">
              <a href="/events" onClick={(e) => { e.preventDefault(); navigate('/events'); }}>
                <span>🎵</span> Concerts
              </a>
              <a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }}>
                <span>📰</span> Blog
              </a>
              <a href="/spirituality" onClick={(e) => { e.preventDefault(); navigate('/spirituality'); }}>
                <span>🙏</span> Spiritualité
              </a>
            </div>
          </div>

          <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="nav-link">
            <span>📞</span> Contact
          </a>
        </nav>

        {/* Section Utilisateur Desktop */}
        <div className="user-section">
          {isAuthenticated ? (
            <div className="user-info-desktop">
              <span className="user-greeting">
                Bonjour, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Utilisateur'}
              </span>
              <span className="user-role-badge">
                {getRoleLabel()}
              </span>
              <a href={getDashboardPath()} onClick={(e) => { e.preventDefault(); navigate(getDashboardPath()); }} className="btn btn-primary">
                {getDashboardIcon()} {getDashboardLabel()}
              </a>
              <button onClick={handleLogout} className="btn btn-secondary">
                🚪 Déco
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <a href="/join" onClick={(e) => { e.preventDefault(); navigate('/join'); }} className="btn btn-secondary">
                👥 Rejoindre
              </a>
              <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="btn btn-primary">
                🔐 Connexion
              </a>
            </div>
          )}
        </div>

        {/* Menu Burger Musical */}
        <button 
          className={`menu-burger-music ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span className="music-icon closed">🎵</span>
          <span className="music-icon open">🎶</span>
        </button>
      </div>

      {/* Menu Mobile */}
      <nav className={`sacred-navigation-mobile ${isMenuOpen ? 'active' : ''}`}>
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); closeMenu(); }} className="mobile-nav-item">
          <span>🏠</span> Accueil
        </a>

        <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); closeMenu(); }} className="mobile-nav-item">
          <span>🌟</span> À Propos
        </a>

        <a href="/events" onClick={(e) => { e.preventDefault(); navigate('/events'); closeMenu(); }} className="mobile-nav-item">
          <span>🎵</span> Concerts
        </a>

        <a href="/gallery" onClick={(e) => { e.preventDefault(); navigate('/gallery'); closeMenu(); }} className="mobile-nav-item">
          <span>🖼️</span> Galerie
        </a>

        <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); closeMenu(); }} className="mobile-nav-item">
          <span>📞</span> Contact
        </a>

        <div className="nav-divider"></div>

        {isAuthenticated ? (
          <>
            <a href={getDashboardPath()} onClick={(e) => { e.preventDefault(); navigate(getDashboardPath()); closeMenu(); }} className="mobile-nav-item dashboard-item">
              <span>{getDashboardIcon()}</span> {getDashboardLabel()}
            </a>
            <a href="/app/profile" onClick={(e) => { e.preventDefault(); navigate('/app/profile'); closeMenu(); }} className="mobile-nav-item">
              <span>👤</span> Profil
            </a>
            <div className="mobile-nav-item" style={{ opacity: 0.7, fontStyle: 'italic' }}>
              <span>🎭</span> {getRoleLabel()}
            </div>
            <button onClick={handleLogout} className="mobile-nav-item logout-item">
              <span>🚪</span> Déconnexion
            </button>
          </>
        ) : (
          <>
            <a href="/join" onClick={(e) => { e.preventDefault(); navigate('/join'); closeMenu(); }} className="mobile-nav-item">
              <span>👥</span> Nous Rejoindre
            </a>
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); closeMenu(); }} className="mobile-nav-item">
              <span>🔐</span> Connexion
            </a>
          </>
        )}
      </nav>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
    </header>
  );
};

export default Header;