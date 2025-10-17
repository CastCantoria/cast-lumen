# init-project.ps1 - Script d'initialisation complet du projet CAST Lumen
param(
    [string]$ProjectName = "cast-lumen",
    [switch]$SetupFirebase,
    [switch]$DevMode
)

Write-Host "🎵 Initialisation du projet C.A.S.T. Lumen..." -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan

# Fonction pour vérifier les prérequis
function Test-Prerequisites {
    Write-Host "`n🔍 Vérification des prérequis..." -ForegroundColor Yellow
    
    $prerequisites = @(
        @{ Name = "Node.js"; Command = "node --version" },
        @{ Name = "npm"; Command = "npm --version" },
        @{ Name = "Git"; Command = "git --version" }
    )
    
    foreach ($req in $prerequisites) {
        try {
            $version = Invoke-Expression $req.Command 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ $($req.Name) : $version" -ForegroundColor Green
            } else {
                throw "Non installé"
            }
        } catch {
            Write-Host "❌ $($req.Name) : Non installé" -ForegroundColor Red
            return $false
        }
    }
    return $true
}

# Fonction pour créer la structure de dossiers
function New-ProjectStructure {
    Write-Host "`n📁 Création de la structure du projet..." -ForegroundColor Yellow
    
    $folders = @(
        "src",
        "src/components",
        "src/components/admin",
        "src/components/layout", 
        "src/components/ui",
        "src/components/sections",
        "src/pages",
        "src/pages/public",
        "src/pages/admin",
        "src/contexts",
        "src/hooks", 
        "src/lib",
        "src/utils",
        "src/styles",
        "public",
        "public/images",
        "public/audio",
        "public/videos",
        "firebase",
        "scripts",
        "docs"
    )
    
    foreach ($folder in $folders) {
        if (!(Test-Path $folder)) {
            New-Item -ItemType Directory -Path $folder -Force | Out-Null
            Write-Host "📂 Créé : $folder" -ForegroundColor Blue
        }
    }
}

# Fonction pour créer les fichiers de configuration
function New-ConfigFiles {
    Write-Host "`n⚙️  Création des fichiers de configuration..." -ForegroundColor Yellow
    
    # package.json
    $packageJson = @{
        name = $ProjectName
        private = $true
        version = "1.0.0"
        type = "module"
        scripts = @{
            dev = "vite"
            build = "vite build"
            preview = "vite preview"
            deploy = "vite build && vercel --prod"
            lint = "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
            "dev-win" = "powershell -File ./scripts/dev.ps1"
            "build-win" = "powershell -File ./scripts/build.ps1"
            "deploy-win" = "powershell -File ./scripts/deploy.ps1"
        }
        dependencies = @{
            react = "^18.2.0"
            "react-dom" = "^18.2.0"
            "react-router-dom" = "^6.20.1"
            firebase = "^10.7.1"
        }
        devDependencies = @{
            "@types/react" = "^18.2.43"
            "@types/react-dom" = "^18.2.17"
            "@vitejs/plugin-react" = "^4.2.1"
            autoprefixer = "^10.4.16"
            postcss = "^8.4.32"
            tailwindcss = "^3.3.6"
            vite = "^5.0.8"
        }
    }
    
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
    Write-Host "📄 Créé : package.json" -ForegroundColor Blue
    
    # Vite config
    $viteConfig = @'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
'@
    Set-Content -Path "vite.config.js" -Value $viteConfig
    Write-Host "📄 Créé : vite.config.js" -ForegroundColor Blue
    
    # Tailwind config
    $tailwindConfig = @'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C5530',
        secondary: '#8B4513', 
        accent: '#D4AF37',
        light: '#F8F5F0',
        dark: '#1A1A1A',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'cormorant': ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
'@
    Set-Content -Path "tailwind.config.js" -Value $tailwindConfig
    Write-Host "📄 Créé : tailwind.config.js" -ForegroundColor Blue
}

# Fonction pour créer les composants de base
function New-BaseComponents {
    Write-Host "`n🔧 Création des composants de base..." -ForegroundColor Yellow
    
    # Header avec ton code
    $headerCode = @'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    closeMenu();
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
            className={`dropdown-toggle ${activeDropdown === 'discover' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('discover');
            }}
          >
            <span>🌟</span> Découverte
            <span className="dropdown-arrow">▼</span>
          </button>
          <div className={`dropdown-menu ${activeDropdown === 'discover' ? 'active' : ''}`}>
            <a href="/about" onClick={(e) => { e.preventDefault(); navigateTo('/about'); }}>
              <span>ℹ️</span> À Propos
            </a>
            <a href="/repertoire" onClick={(e) => { e.preventDefault(); navigateTo('/repertoire'); }}>
              <span>📜</span> Répertoire
            </a>
            <a href="/gallery" onClick={(e) => { e.preventDefault(); navigateTo('/gallery'); }}>
              <span>🖼️</span> Galerie
            </a>
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
            <a href="/events" onClick={(e) => { e.preventDefault(); navigateTo('/events'); }}>
              <span>🎵</span> Concerts
            </a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); navigateTo('/blog'); }}>
              <span>📰</span> Blog
            </a>
            <a href="/spirituality" onClick={(e) => { e.preventDefault(); navigateTo('/spirituality'); }}>
              <span>🙏</span> Spiritualité
            </a>
          </div>
        </div>

        {/* Séparateur visuel */}
        <div className="nav-divider"></div>

        {/* État de connexion */}
        {user ? (
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
                {user.member?.firstName?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className={`dropdown-menu user-dropdown ${activeDropdown === 'user' ? 'active' : ''}`}>
              <div className="user-info">
                <strong>{user.member?.firstName || user.name || user.email}</strong>
                {user.member?.firstName && <span>{user.email}</span>}
              </div>
              <div className="dropdown-divider"></div>
              <a href="/dashboard" onClick={(e) => { e.preventDefault(); navigateTo('/dashboard'); }}>
                <span>📊</span> Tableau de bord
              </a>
              <a href="/profile" onClick={(e) => { e.preventDefault(); navigateTo('/profile'); }}>
                <span>⚙️</span> Mon profil
              </a>
              {user.role === 'ADMIN' && (
                <a href="/admin" onClick={(e) => { e.preventDefault(); navigateTo('/admin'); }}>
                  <span>👑</span> Administration
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
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className={`dropdown-menu login-dropdown ${activeDropdown === 'login' ? 'active' : ''}`}>
              <a href="/login" onClick={(e) => { e.preventDefault(); navigateTo('/login'); }}>
                <span>🔐</span> Se connecter
              </a>
              <a href="/register" onClick={(e) => { e.preventDefault(); navigateTo('/register'); }}>
                <span>📝</span> S'inscrire
              </a>
              <div className="dropdown-divider"></div>
              <a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('/contact'); }}>
                <span>📞</span> Contact
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
'@
    Set-Content -Path "src/components/layout/Header.jsx" -Value $headerCode
    Write-Host "📄 Créé : Header.jsx" -ForegroundColor Blue
    
    # CSS du Header (tu dois avoir ce fichier dans ton dossier)
    $headerCss = @'
/* frontend/src/components/Header.css */
.sacred-header {
  background: linear-gradient(135deg, #2c5530 0%, #4a7c59 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: relative;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  z-index: 1001;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.header-brand:hover {
  transform: translateY(-2px);
}

/* Container du logo */
.logo-container {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  cursor: pointer;
}

/* Image du logo */
.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.logo-image:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.3);
}

/* Fallback si l'image ne charge pas */
.logo-fallback {
  display: none;
  width: 100%;
  height: 100%;
  background: white;
  color: #4a7c59;
  border-radius: 50%;
  border: 3px solid white;
  font-size: 1.8rem;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo-fallback:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.3);
}

.brand-text {
  cursor: pointer;
}

.brand-text h1 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  transition: color 0.3s ease;
  font-family: 'Times New Roman', serif;
  font-weight: normal;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  line-height: 1.1;
}

.brand-text:hover h1 {
  color: rgba(255,255,255,0.9);
}

/* Texte gothique Unicode */
.gothic-unicode {
  margin: 0;
  font-style: italic;
  opacity: 0.95;
  font-size: clamp(0.8rem, 2vw, 1rem);
  transition: opacity 0.3s ease;
  font-family: 'Times New Roman', serif;
  letter-spacing: 0.5px;
  color: #f0f8ff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
  margin-top: 0.3rem;
  line-height: 1.2;
}

.brand-text:hover .gothic-unicode {
  opacity: 1;
  color: #ffffff;
}

/* Menu Burger Musical */
.menu-burger-music {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  width: 50px;
  height: 50px;
  position: relative;
  z-index: 1001;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  border-radius: 50%;
  color: #e8f5e8;
}

.menu-burger-music:hover {
  background: rgba(232, 245, 232, 0.1);
  transform: scale(1.1);
}

.music-icon {
  display: block;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.music-icon.open {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8) rotate(-90deg);
}

.music-icon.closed {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) rotate(0deg);
}

.menu-burger-music.active .music-icon.open {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) rotate(0deg);
}

.menu-burger-music.active .music-icon.closed {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8) rotate(90deg);
}

/* Animation de vibration musicale */
@keyframes musicVibrate {
  0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
  25% { transform: translate(-50%, -50%) scale(1.1) rotate(-5deg); }
  50% { transform: translate(-50%, -50%) scale(1.05) rotate(5deg); }
  75% { transform: translate(-50%, -50%) scale(1.1) rotate(-3deg); }
}

.menu-burger-music:hover .music-icon.closed {
  animation: musicVibrate 0.6s ease;
}

/* Navigation */
.sacred-navigation {
  display: flex;
  gap: 2rem;
  align-items: center;
  transition: all 0.3s ease;
}

.sacred-navigation a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-size: 1rem;
  position: relative;
  font-family: 'Times New Roman', serif;
  letter-spacing: 0.5px;
}

.sacred-navigation a:hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

.login-btn {
  background: rgba(255,255,255,0.2);
  border: 1px solid white;
  font-family: 'Times New Roman', serif;
}

.login-btn:hover {
  background: rgba(255,255,255,0.3);
}

/* Navigation avec icônes */
.sacred-navigation a span {
  font-size: 1.2rem;
  margin-right: 0.8rem;
  transition: transform 0.3s ease;
}

.sacred-navigation a:hover span {
  transform: scale(1.2);
}

/* Overlay */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 998;
  display: none;
}

/* ===== STYLES POUR LES DROPDOWNS ===== */

.nav-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  background: none;
  border: none;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  padding: 1rem 1.5rem;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.dropdown-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-arrow {
  margin-left: auto;
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.dropdown-toggle.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: linear-gradient(135deg, #2c1a4d 0%, #1a0d2c 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-width: 220px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dropdown-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.dropdown-menu a:last-child {
  border-bottom: none;
}

.dropdown-menu a:hover {
  background: rgba(255, 255, 255, 0.1);
  padding-left: 1.5rem;
}

/* ===== STYLES POUR LE MENU UTILISATEUR ===== */

/* Menu utilisateur connecté */
.user-menu .user-avatar-toggle {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  background: linear-gradient(135deg, #4a7c59 0%, #5d9c6e 100%);
  color: white;
  border: none;
  transition: all 0.3s ease;
  font-family: 'Times New Roman', serif;
  letter-spacing: 0.5px;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: #4a7c59;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.user-menu .dropdown-toggle:hover {
  background: linear-gradient(135deg, #5d9c6e 0%, #6ebc7e 100%);
  transform: translateY(-2px);
}

.user-menu .dropdown-toggle:hover .user-avatar {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.8);
}

/* Menu connexion non connecté */
.login-menu .login-icon-toggle {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  font-family: 'Times New Roman', serif;
  letter-spacing: 0.5px;
}

.login-icon {
  font-size: 1.3rem;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.login-menu .dropdown-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.login-menu .dropdown-toggle:hover .login-icon {
  transform: scale(1.2);
}

/* Dropdown utilisateur amélioré */
.user-dropdown, .login-dropdown {
  min-width: 220px;
  right: 0;
  left: auto;
  background: linear-gradient(135deg, #2c1a4d 0%, #1a0d2c 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0;
  overflow: hidden;
}

.user-info {
  padding: 1rem 1.2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info strong {
  display: block;
  color: #ffffff;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
  font-family: 'Times New Roman', serif;
}

.user-info span {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Times New Roman', serif;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.3rem 0;
}

.user-dropdown a,
.login-dropdown a {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  font-family: 'Times New Roman', serif;
}

.user-dropdown a:last-child,
.login-dropdown a:last-child {
  border-bottom: none;
}

.user-dropdown a:hover,
.login-dropdown a:hover {
  background: rgba(255, 255, 255, 0.1);
  padding-left: 1.5rem;
}

.logout-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  font: inherit;
  cursor: pointer;
  width: 100%;
  text-align: left;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  border-bottom: none !important;
  font-family: 'Times New Roman', serif;
}

.logout-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  padding-left: 1.5rem;
  color: #ff5252;
}

/* Style pour le bouton "Nous Rejoindre" */
.join-btn {
  background: linear-gradient(135deg, #4a7c59 0%, #5d9c6e 100%);
  border: 1px solid #4a7c59;
  font-weight: bold;
}

.join-btn:hover {
  background: linear-gradient(135deg, #5d9c6e 0%, #6ebc7e 100%);
}

/* Style pour le bouton Contact */
.contact-btn {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
}

.contact-btn:hover {
  background: rgba(255,255,255,0.25);
}

/* Séparateur dans la navigation mobile */
.nav-divider {
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.2);
  margin: 1rem 0;
}

/* ===== RESPONSIVE ===== */

/* Tablette */
@media (max-width: 1024px) {
  .sacred-header {
    padding: 1rem 1.5rem;
  }
  
  .sacred-navigation {
    gap: 1rem;
  }
  
  .sacred-navigation a {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .sacred-header {
    padding: 1rem;
  }
  
  .menu-burger-music {
    display: block;
  }
  
  .logo-container {
    width: 50px;
    height: 50px;
  }
  
  .logo-fallback {
    font-size: 1.5rem;
  }
  
  .brand-text h1 {
    font-size: clamp(1.5rem, 4vw, 1.8rem);
  }
  
  .gothic-unicode {
    font-size: 0.7rem;
  }
  
  .sacred-navigation {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background: linear-gradient(135deg, #2c5530 0%, #4a7c59 100%);
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 100px;
    gap: 0;
    z-index: 1000;
    transition: right 0.3s ease;
    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
  }
  
  .sacred-navigation.active {
    right: 0;
  }
  
  .sacred-navigation a {
    width: 100%;
    padding: 1.2rem 2rem;
    border-radius: 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    text-align: left;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    font-family: 'Times New Roman', serif;
  }
  
  .sacred-navigation a:hover {
    background: rgba(255,255,255,0.1);
    padding-left: 2.5rem;
  }
  
  .sacred-navigation a:hover span {
    transform: scale(1.3);
  }
  
  .menu-overlay {
    display: block;
  }
  
  .login-btn {
    background: rgba(255,255,255,0.15);
    margin-top: 1rem;
    border: none;
    border-top: 1px solid rgba(255,255,255,0.2);
    border-bottom: 1px solid rgba(255,255,255,0.2);
    font-family: 'Times New Roman', serif;
  }
  
  .login-btn:hover {
    background: rgba(255,255,255,0.25);
  }
  
  /* Styles mobile pour les dropdowns */
  .dropdown-menu {
    position: static;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 0;
    box-shadow: none;
    transform: none;
    max-height: 0;
    overflow: hidden;
  }
  
  .dropdown-menu.active {
    max-height: 300px;
  }
  
  .dropdown-toggle {
    justify-content: space-between;
  }
  
  /* Styles mobile pour le menu utilisateur */
  .user-menu .user-avatar-toggle,
  .login-menu .login-icon-toggle {
    width: 100%;
    padding: 1.2rem 2rem;
    border-radius: 0;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    justify-content: flex-start;
  }
  
  .user-avatar,
  .login-icon {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
  
  .user-menu .dropdown-toggle span,
  .login-menu .dropdown-toggle span {
    display: inline-block;
    font-size: 1rem;
  }
  
  .user-dropdown,
  .login-dropdown {
    position: static;
    background: rgba(255, 255, 255, 0.02);
    border: none;
    border-radius: 0;
    box-shadow: none;
    min-width: auto;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .user-dropdown.active,
  .login-dropdown.active {
    max-height: 400px;
  }
  
  .user-info {
    background: rgba(255, 255, 255, 0.03);
    margin: 0.5rem 1rem;
    border-radius: 5px;
    padding: 0.8rem 1rem;
  }
  
  .user-dropdown a,
  .login-dropdown a,
  .logout-btn {
    padding: 1rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .user-dropdown a:hover,
  .login-dropdown a:hover,
  .logout-btn:hover {
    padding-left: 2.5rem;
    background: rgba(255, 255, 255, 0.08);
  }
  
  .join-btn,
  .contact-btn {
    background: rgba(255,255,255,0.1);
    border: none;
    border-top: 1px solid rgba(255,255,255,0.2);
    border-radius: 0;
    margin-top: 0.5rem;
  }
}

/* Petit mobile */
@media (max-width: 480px) {
  .sacred-header {
    padding: 0.8rem;
  }
  
  .logo-container {
    width: 45px;
    height: 45px;
  }
  
  .logo-fallback {
    font-size: 1.3rem;
  }
  
  .brand-text h1 {
    font-size: 1.4rem;
  }
  
  .gothic-unicode {
    font-size: 0.65rem;
  }
  
  .menu-burger-music {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }
  
  .sacred-navigation {
    width: 85%;
    padding-top: 90px;
  }
  
  .sacred-navigation a {
    padding: 1.2rem 1.5rem;
    font-size: 1rem;
  }
  
  .sacred-navigation a:hover {
    padding-left: 2rem;
  }
  
  .user-menu .user-avatar-toggle,
  .login-menu .login-icon-toggle {
    padding: 1rem 1.5rem;
  }
  
  .user-dropdown a,
  .login-dropdown a,
  .logout-btn {
    padding: 0.8rem 1.5rem;
  }
  
  .user-dropdown a:hover,
  .login-dropdown a:hover,
  .logout-btn:hover {
    padding-left: 2rem;
  }
  
  .user-avatar,
  .login-icon {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
}

/* Animation d'apparition des liens */
@keyframes musicalSlideIn {
  from {
    opacity: 0;
    transform: translateX(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.sacred-navigation.active a {
  animation: musicalSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.sacred-navigation.active a:nth-child(1) { animation-delay: 0.1s; }
.sacred-navigation.active a:nth-child(2) { animation-delay: 0.15s; }
.sacred-navigation.active a:nth-child(3) { animation-delay: 0.2s; }
.sacred-navigation.active a:nth-child(4) { animation-delay: 0.25s; }
.sacred-navigation.active a:nth-child(5) { animation-delay: 0.3s; }

/* Animation pour le dropdown utilisateur */
@keyframes userDropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.user-dropdown.active,
.login-dropdown.active {
  animation: userDropdownFade 0.3s ease-out;
}

/* Masquer les icônes sur desktop */
@media (min-width: 769px) {
  .sacred-navigation a span {
    display: none;
  }
  
  .nav-divider {
    display: none;
  }
  
  .user-menu,
  .login-menu {
    margin-left: auto;
  }
  
  .user-menu .dropdown-toggle span:not(.dropdown-arrow),
  .login-menu .dropdown-toggle span:not(.dropdown-arrow) {
    display: none;
  }
  
  .user-dropdown a span,
  .login-dropdown a span,
  .logout-btn span {
    display: inline-block;
  }
}

/* Adaptation pour l'ordre des éléments dans la navigation */
@media (min-width: 769px) {
  .join-btn {
    order: 1;
  }
  
  .contact-btn {
    order: 2;
  }
  
  .login-btn {
    order: 3;
  }
}
'@
    Set-Content -Path "src/components/layout/Header.css" -Value $headerCss
    Write-Host "📄 Créé : Header.css" -ForegroundColor Blue
    
    # Footer avec ton code
    $footerCode = @'
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sacred-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <strong>C.A.S.T. Cantoria</strong>
          <p>Chœur Artistique & Spirituel de Tanà</p>
        </div>
        
        <div className="footer-info">
          <p>Fondé en 2003 à Antananarivo</p>
          <div className="footer-contact">
            <p>📧 castcantoria@gmail.com</p>
            <p>📞 +261 34 11 361 57</p>
            <p>📱 +261 32 91 828 83</p>
          </div>
        </div>
        
        <div className="footer-copyright">
          <p>&copy; 2003 - {currentYear} C.A.S.T. Cantoria - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
'@
    Set-Content -Path "src/components/layout/Footer.jsx" -Value $footerCode
    Write-Host "📄 Créé : Footer.jsx" -ForegroundColor Blue
    
    # CSS du Footer
    $footerCss = @'
/* frontend/src/components/Footer.css */
.sacred-footer {
  background: linear-gradient(135deg, #2c5530 0%, #4a7c59 100%);
  color: white;
  padding: 2rem 1rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-brand strong {
  font-size: 1.2rem;
  font-family: 'Times New Roman', serif;
  display: block;
  margin-bottom: 0.5rem;
}

.footer-brand p {
  font-style: italic;
  margin: 0;
}

.footer-info p {
  margin: 0.3rem 0;
}

.footer-contact {
  margin-top: 1rem;
}

.footer-contact p {
  margin: 0.2rem 0;
}

.footer-copyright {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.footer-copyright p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    padding: 0 1rem;
  }
  
  .footer-contact p {
    font-size: 0.9rem;
  }
}
'@
    Set-Content -Path "src/components/layout/Footer.css" -Value $footerCss
    Write-Host "📄 Créé : Footer.css" -ForegroundColor Blue
}

# Fonction pour créer les fichiers essentiels
function New-EssentialFiles {
    Write-Host "`n📝 Création des fichiers essentiels..." -ForegroundColor Yellow
    
    # main.jsx
    $mainJsx = @'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
'@
    Set-Content -Path "src/main.jsx" -Value $mainJsx
    
    # App.jsx
    $appJsx = @'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/public/Home'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<div className="container mx-auto px-4 py-20">À Propos - En construction</div>} />
              <Route path="/repertoire" element={<div className="container mx-auto px-4 py-20">Répertoire - En construction</div>} />
              <Route path="/events" element={<div className="container mx-auto px-4 py-20">Concerts - En construction</div>} />
              <Route path="/gallery" element={<div className="container mx-auto px-4 py-20">Galerie - En construction</div>} />
              <Route path="/spirituality" element={<div className="container mx-auto px-4 py-20">Spiritualité - En construction</div>} />
              <Route path="/blog" element={<div className="container mx-auto px-4 py-20">Blog - En construction</div>} />
              <Route path="/contact" element={<div className="container mx-auto px-4 py-20">Contact - En construction</div>} />
              <Route path="/login" element={<div className="container mx-auto px-4 py-20">Login - En construction</div>} />
              <Route path="/admin" element={<div className="container mx-auto px-4 py-20">Admin - En construction</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
'@
    Set-Content -Path "src/App.jsx" -Value $appJsx
    
    # Home page
    $homePage = @'
import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-primary/90 to-dark/90 text-light">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511376868136-009c8cac6a6d?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Quand l'art devient prière,
              <span className="text-accent block">la musique touche l'âme</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-light/90 leading-relaxed">
              Fondé en 2003 à Antananarivo, le C.A.S.T. est un ensemble vocal dont l'essence 
              repose sur le souffle sacré de la musique.
            </p>
            
            <div className="flex space-x-4">
              <button className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                Découvrir le Chœur
              </button>
              <button className="border-2 border-light text-light px-8 py-3 rounded-lg font-semibold hover:bg-light hover:text-dark transition-colors">
                Prochains Concerts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* In Memoriam Section */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-dark mb-8">
              In Memoriam
            </h2>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-left">
              <h3 className="font-serif text-2xl text-primary mb-4">
                Monsieur Lucien Emmanuel RANDRIANARIVELO (†)
              </h3>
              
              <p className="text-dark/80 mb-6 leading-relaxed">
                À l'image d'un orfèvre du sacré, il a patiemment transcrit les partitions complexes 
                en grilles solfa accessibles, offrant à chaque choriste le don de compréhension.
              </p>
              
              <p className="text-dark/80 mb-6 leading-relaxed">
                Mais sa mission allait plus loin : il a offert une âme malgache aux chefs-d'œuvre 
                classiques, traduisant leurs paroles avec délicatesse, fidélité et spiritualité.
              </p>
              
              <blockquote className="border-l-4 border-accent pl-4 italic text-dark/70 mb-6">
                "Misaotra anao, Raiamandreny. Ianao no nandika sy nandray ny feon'ny lanitra 
                ho tenin'ny tanindrazana."
              </blockquote>
              
              <p className="text-dark/60">
                Son héritage est immatériel, mais palpable à chaque instant, dans chaque vibration du chœur.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
'@
    Set-Content -Path "src/pages/public/Home.jsx" -Value $homePage
    
    # AuthContext
    $authContext = @'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    return signOut(auth)
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
'@
    Set-Content -Path "src/contexts/AuthContext.jsx" -Value $authContext
    
    # Firebase config
    $firebaseConfig = @'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export default app
'@
    Set-Content -Path "src/lib/firebase.js" -Value $firebaseConfig
    
    # Global CSS
    $globalCss = @'
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.font-serif {
  font-family: 'Playfair Display', serif;
}

.font-cormorant {
  font-family: 'Cormorant Garamond', serif;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #2C5530;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #1e3a23;
}
'@
    Set-Content -Path "src/styles/globals.css" -Value $globalCss
    
    # Environment template
    $envTemplate = @'
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
'@
    Set-Content -Path ".env.example" -Value $envTemplate
    
    Write-Host "✅ Tous les fichiers essentiels créés" -ForegroundColor Green
}

# Fonction pour installer les dépendances
function Install-Dependencies {
    Write-Host "`n📦 Installation des dépendances..." -ForegroundColor Yellow
    
    # Vérifier si node_modules existe déjà
    if (Test-Path "node_modules") {
        $choice = Read-Host "node_modules existe déjà. Voulez-vous le supprimer et réinstaller ? (y/N)"
        if ($choice -eq 'y') {
            Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
        } else {
            Write-Host "⏩ Installation des dépendances ignorée" -ForegroundColor Yellow
            return
        }
    }
    
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dépendances installées avec succès" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    }
}

# Fonction pour configurer Firebase
function Setup-FirebaseProject {
    Write-Host "`n🔥 Configuration Firebase..." -ForegroundColor Yellow
    
    # Créer le fichier de règles Firebase
    $firebaseRules = @'
// firebase/firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }
  }
}
'@
    Set-Content -Path "firebase/firestore.rules" -Value $firebaseRules
    
    # Créer le script de seeding
    $seedScript = @'
// firebase/seed.js - Script pour peupler la base de données initiale
import { db } from '../src/lib/firebase.js';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

const seedData = async () => {
  console.log('🌱 Début du seeding Firebase...');
  
  // Collection des configurations
  const configs = {
    site: {
      name: "C.A.S.T. Cantoria",
      description: "Chœur Artistique & Spirituel de Tanà",
      founded: 2003,
      contact: {
        email: "castcantoria@gmail.com",
        phone: "+261 34 11 361 57"
      }
    }
  };
  
  try {
    // Créer les configurations
    await setDoc(doc(db, 'configurations', 'site'), configs.site);
    console.log('✅ Configurations créées');
    
    console.log('🎉 Seeding terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  }
};

// Exécuter le seeding
seedData();
'@
    Set-Content -Path "firebase/seed.js" -Value $seedScript
    
    Write-Host "✅ Configuration Firebase créée" -ForegroundColor Green
    Write-Host "📝 N'oubliez pas de configurer vos variables d'environnement dans .env" -ForegroundColor Yellow
}

# Fonction pour créer les scripts utilitaires
function New-UtilityScripts {
    Write-Host "`n🔧 Création des scripts utilitaires..." -ForegroundColor Yellow
    
    # Script de développement
    $devScript = @'
# scripts/dev.ps1 - Script de développement
Write-Host "🚀 Démarrage du serveur de développement..." -ForegroundColor Green

# Vérifier si .env existe
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Fichier .env non trouvé. Copie depuis .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
    Write-Host "📝 Veuillez configurer vos variables Firebase dans le fichier .env" -ForegroundColor Yellow
}

# Démarrer Vite
Write-Host "🎵 Serveur C.A.S.T. Lumen démarré sur http://localhost:3000" -ForegroundColor Cyan
npm run dev
'@
    Set-Content -Path "scripts/dev.ps1" -Value $devScript
    
    # Script de build
    $buildScript = @'
# scripts/build.ps1 - Script de build de production
Write-Host "🔨 Construction de l'application..." -ForegroundColor Green

# Vérifier les variables d'environnement
if (!(Test-Path ".env")) {
    Write-Host "❌ Fichier .env non trouvé. Veuillez le créer à partir de .env.example" -ForegroundColor Red
    exit 1
}

# Build avec Vite
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build terminé avec succès !" -ForegroundColor Green
    Write-Host "📁 Dossier de build : ./dist" -ForegroundColor Blue
} else {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}
'@
    Set-Content -Path "scripts/build.ps1" -Value $buildScript
    
    # Script de déploiement
    $deployScript = @'
# scripts/deploy.ps1 - Script de déploiement Vercel
Write-Host "🚀 Déploiement sur Vercel..." -ForegroundColor Green

# Build l'application
Write-Host "🔨 Construction de l'application..." -ForegroundColor Yellow
.\scripts\build.ps1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build échoué, arrêt du déploiement" -ForegroundColor Red
    exit 1
}

# Vérifier si Vercel CLI est installé
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Vercel CLI non installé"
    }
    Write-Host "✅ Vercel CLI: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI non installé. Installation..." -ForegroundColor Yellow
    npm install -g vercel
}

# Déployer
Write-Host "🌐 Déploiement en cours..." -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Déploiement réussi !" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
}
'@
    Set-Content -Path "scripts/deploy.ps1" -Value $deployScript
    
    # Script de nettoyage
    $cleanScript = @'
# scripts/clean.ps1 - Script de nettoyage
Write-Host "🧹 Nettoyage du projet..." -ForegroundColor Yellow

$itemsToClean = @(
    "node_modules",
    "dist",
    ".vite",
    "coverage"
)

foreach ($item in $itemsToClean) {
    if (Test-Path $item) {
        Remove-Item -Recurse -Force $item
        Write-Host "🗑️  Supprimé: $item" -ForegroundColor Blue
    }
}

Write-Host "✅ Nettoyage terminé" -ForegroundColor Green
'@
    Set-Content -Path "scripts/clean.ps1" -Value $cleanScript
    
    Write-Host "✅ Scripts utilitaires créés" -ForegroundColor Green
}

# Fonction principale
function Main {
    Write-Host "`n🎵 INITIALISATION CAST LUMEN" -ForegroundColor Magenta
    Write-Host "=============================" -ForegroundColor Cyan
    
    # Vérifier les prérequis
    if (!(Test-Prerequisites)) {
        Write-Host "`n❌ Prérequis manquants. Veuillez installer les logiciels requis." -ForegroundColor Red
        exit 1
    }
    
    # Créer la structure
    New-ProjectStructure
    
    # Créer les fichiers de configuration
    New-ConfigFiles
    
    # Créer les composants de base
    New-BaseComponents
    
    # Créer les fichiers essentiels
    New-EssentialFiles
    
    # Créer les scripts utilitaires
    New-UtilityScripts
    
    # Configurer Firebase si demandé
    if ($SetupFirebase) {
        Setup-FirebaseProject
    }
    
    # Installer les dépendances
    Install-Dependencies
    
    # Message final
    Write-Host "`n🎉 PROJET CAST LUMEN INITIALISÉ AVEC SUCCÈS !" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Cyan
    
    Write-Host "`n📋 Prochaines étapes :" -ForegroundColor Yellow
    Write-Host "1. Configurez Firebase dans le fichier .env" -ForegroundColor White
    Write-Host "2. Lancez le développement: npm run dev-win" -ForegroundColor White  
    Write-Host "3. Ouvrez http://localhost:3000" -ForegroundColor White
    Write-Host "4. Commencez à développer !" -ForegroundColor White
    
    Write-Host "`n🚀 Commandes disponibles :" -ForegroundColor Cyan
    Write-Host "   npm run dev-win     - Mode développement" -ForegroundColor Gray
    Write-Host "   npm run build-win   - Build production" -ForegroundColor Gray
    Write-Host "   npm run deploy-win  - Déploiement Vercel" -ForegroundColor Gray
    Write-Host "   .\scripts\clean.ps1 - Nettoyage du projet" -ForegroundColor Gray
    
    if ($DevMode) {
        Write-Host "`n🔧 Mode développement activé - Démarrage du serveur..." -ForegroundColor Green
        Start-Sleep -Seconds 2
        .\scripts\dev.ps1
    }
}

# Exécution du script
Main