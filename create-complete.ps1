# create-complete.ps1 - Crée TOUS les fichiers manquants
Write-Host "🎵 CRÉATION COMPLÈTE DU PROJET C.A.S.T. LUMEN..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé!" -ForegroundColor Red
    exit 1
}

# Créer la structure des dossiers
Write-Host "`n📁 Création de la structure..." -ForegroundColor Yellow

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
    "src/styles"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "📂 Créé: $folder" -ForegroundColor Blue
    }
}

# Encodage UTF-8 sans BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# 1. FICHIER INDEX.HTML
Write-Host "`n📄 Création de index.html..." -ForegroundColor Yellow
$indexHtml = @'
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo-cast.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>C.A.S.T. Lumen - Chœur Artistique & Spirituel de Tanà</title>
    <meta name="description" content="Chœur Artistique & Spirituel de Tanà - Quand l'art devient prière, la musique touche l'âme">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'@
[System.IO.File]::WriteAllText("$PWD/index.html", $indexHtml, $utf8NoBom)
Write-Host "✅ index.html créé" -ForegroundColor Green

# 2. PACKAGE.JSON
Write-Host "`n📄 Création de package.json..." -ForegroundColor Yellow
$packageJson = @'
{
  "name": "cast-lumen",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && vercel --prod"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "firebase": "^10.7.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
'@
[System.IO.File]::WriteAllText("$PWD/package.json", $packageJson, $utf8NoBom)
Write-Host "✅ package.json créé" -ForegroundColor Green

# 3. VITE CONFIG
Write-Host "`n📄 Création de vite.config.js..." -ForegroundColor Yellow
$viteConfig = @'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
'@
[System.IO.File]::WriteAllText("$PWD/vite.config.js", $viteConfig, $utf8NoBom)
Write-Host "✅ vite.config.js créé" -ForegroundColor Green

# 4. TAILWIND CONFIG
Write-Host "`n📄 Création de tailwind.config.js..." -ForegroundColor Yellow
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
[System.IO.File]::WriteAllText("$PWD/tailwind.config.js", $tailwindConfig, $utf8NoBom)
Write-Host "✅ tailwind.config.js créé" -ForegroundColor Green

# 5. POSTCSS CONFIG
Write-Host "`n📄 Création de postcss.config.js..." -ForegroundColor Yellow
$postcssConfig = @'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@
[System.IO.File]::WriteAllText("$PWD/postcss.config.js", $postcssConfig, $utf8NoBom)
Write-Host "✅ postcss.config.js créé" -ForegroundColor Green

# 6. FICHIER .ENV
Write-Host "`n📄 Création de .env..." -ForegroundColor Yellow
$envContent = @'
VITE_FIREBASE_API_KEY=AIzaSyCT_8j9KBKgcYr3naOFRp-Kk-s-gr_A1gs
VITE_FIREBASE_AUTH_DOMAIN=cast-84d3f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cast-84d3f
VITE_FIREBASE_STORAGE_BUCKET=cast-84d3f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=160422742820
VITE_FIREBASE_APP_ID=1:160422742820:web:f60e6c94ba743d1afd41b1
VITE_FIREBASE_MEASUREMENT_ID=G-9BNSYK4TH4
'@
[System.IO.File]::WriteAllText("$PWD/.env", $envContent, $utf8NoBom)
Write-Host "✅ .env créé" -ForegroundColor Green

# 7. MAIN.JSX
Write-Host "`n📄 Création de src/main.jsx..." -ForegroundColor Yellow
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
[System.IO.File]::WriteAllText("$PWD/src/main.jsx", $mainJsx, $utf8NoBom)
Write-Host "✅ src/main.jsx créé" -ForegroundColor Green

# 8. APP.JSX
Write-Host "`n📄 Création de src/App.jsx..." -ForegroundColor Yellow
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
        <div className="min-h-screen flex flex-col bg-light">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-serif text-primary">À Propos</h1><p className="mt-4">Page en construction</p></div>} />
              <Route path="/repertoire" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-serif text-primary">Répertoire</h1><p className="mt-4">Page en construction</p></div>} />
              <Route path="/events" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-serif text-primary">Concerts</h1><p className="mt-4">Page en construction</p></div>} />
              <Route path="/gallery" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-serif text-primary">Galerie</h1><p className="mt-4">Page en construction</p></div>} />
              <Route path="/spirituality" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-serif text-primary">Spiritualité</h1><p className="mt-4">Page en construction</p></div>} />
              <Route path="/blog" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-serif text-primary">Blog</h1><p className="mt-4">Page en construction</p></div>} />
              <Route path="/contact" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-serif text-primary">Contact</h1><p className="mt-4">Page en construction</p></div>} />
              <Route path="/login" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-serif text-primary">Connexion</h1><p className="mt-4">Page en construction</p></div>} />
              <Route path="/admin" element={<div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-serif text-primary">Administration</h1><p className="mt-4">Page en construction</p></div>} />
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
[System.IO.File]::WriteAllText("$PWD/src/App.jsx", $appJsx, $utf8NoBom)
Write-Host "✅ src/App.jsx créé" -ForegroundColor Green

# 9. FIREBASE CONFIG
Write-Host "`n📄 Création de src/lib/firebase.js..." -ForegroundColor Yellow
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
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export default app
'@
[System.IO.File]::WriteAllText("$PWD/src/lib/firebase.js", $firebaseConfig, $utf8NoBom)
Write-Host "✅ src/lib/firebase.js créé" -ForegroundColor Green

# 10. AUTH CONTEXT
Write-Host "`n📄 Création de src/contexts/AuthContext.jsx..." -ForegroundColor Yellow
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
[System.IO.File]::WriteAllText("$PWD/src/contexts/AuthContext.jsx", $authContext, $utf8NoBom)
Write-Host "✅ src/contexts/AuthContext.jsx créé" -ForegroundColor Green

# 11. STYLES GLOBAUX
Write-Host "`n📄 Création de src/styles/globals.css..." -ForegroundColor Yellow
$globalCss = @'
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #F8F5F0;
  color: #1A1A1A;
}

.font-serif {
  font-family: 'Playfair Display', serif;
}

.font-cormorant {
  font-family: 'Cormorant Garamond', serif;
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

/* Container utilitaire */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}
'@
[System.IO.File]::WriteAllText("$PWD/src/styles/globals.css", $globalCss, $utf8NoBom)
Write-Host "✅ src/styles/globals.css créé" -ForegroundColor Green

# 12. HEADER COMPOSANT
Write-Host "`n📄 Création de src/components/layout/Header.jsx..." -ForegroundColor Yellow
$headerJsx = @'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigateTo = (path) => {
    navigate(path);
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo et nom */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigateTo('/')}
          >
            <img 
              src="/logo-cast.png" 
              alt="C.A.S.T. Logo" 
              className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo-fallback w-12 h-12 bg-white text-primary rounded-full border-2 border-white flex items-center justify-center font-bold text-lg shadow-lg">
              🎵
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold">C.A.S.T.</h1>
              <p className="text-sm opacity-90">Chœur Artistique & Spirituel de Tanà</p>
            </div>
          </div>

          {/* Menu Burger */}
          <button 
            className="md:hidden text-2xl transition-transform hover:scale-110"
            onClick={toggleMenu}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="hover:text-accent transition-colors font-medium">Accueil</a>
            <a href="/about" className="hover:text-accent transition-colors font-medium">À Propos</a>
            <a href="/repertoire" className="hover:text-accent transition-colors font-medium">Répertoire</a>
            <a href="/events" className="hover:text-accent transition-colors font-medium">Concerts</a>
            <a href="/gallery" className="hover:text-accent transition-colors font-medium">Galerie</a>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                  <span>{user.email}</span>
                  <span>▼</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-dark rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profil</a>
                  <a href="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin</a>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <a href="/login" className="bg-accent text-primary px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                Connexion
              </a>
            )}
          </nav>
        </div>

        {/* Navigation Mobile */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-primary border-t border-white/20 shadow-lg">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              <a href="/" onClick={() => navigateTo('/')} className="py-2 hover:text-accent transition-colors">Accueil</a>
              <a href="/about" onClick={() => navigateTo('/about')} className="py-2 hover:text-accent transition-colors">À Propos</a>
              <a href="/repertoire" onClick={() => navigateTo('/repertoire')} className="py-2 hover:text-accent transition-colors">Répertoire</a>
              <a href="/events" onClick={() => navigateTo('/events')} className="py-2 hover:text-accent transition-colors">Concerts</a>
              <a href="/gallery" onClick={() => navigateTo('/gallery')} className="py-2 hover:text-accent transition-colors">Galerie</a>
              
              <div className="border-t border-white/20 pt-3 mt-3">
                {user ? (
                  <>
                    <a href="/profile" onClick={() => navigateTo('/profile')} className="block py-2 hover:text-accent">Profil</a>
                    <a href="/admin" onClick={() => navigateTo('/admin')} className="block py-2 hover:text-accent">Admin</a>
                    <button onClick={handleLogout} className="w-full text-left py-2 text-red-300 hover:text-red-200">
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <a href="/login" onClick={() => navigateTo('/login')} className="block py-2 bg-accent text-primary text-center rounded-lg font-semibold">
                    Connexion
                  </a>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
'@
[System.IO.File]::WriteAllText("$PWD/src/components/layout/Header.jsx", $headerJsx, $utf8NoBom)
Write-Host "✅ src/components/layout/Header.jsx créé" -ForegroundColor Green

# 13. FOOTER COMPOSANT
Write-Host "`n📄 Création de src/components/layout/Footer.jsx..." -ForegroundColor Yellow
$footerJsx = @'
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">C.A.S.T.</h3>
            <p className="text-light/70 mb-4">
              "Quand l'art devient prière, la musique touche l'âme"
            </p>
            <p className="text-light/60 text-sm">
              Chœur Artistique & Spirituel de Tanà<br />
              Fondé en 2003 à Antananarivo
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-light/70">
              <p>📧 castcantoria@gmail.com</p>
              <p>📞 +261 34 11 361 57</p>
              <p>📱 +261 32 91 828 83</p>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-light/70">
              <a href="/about" className="hover:text-accent transition-colors">À Propos</a>
              <a href="/repertoire" className="hover:text-accent transition-colors">Répertoire</a>
              <a href="/events" className="hover:text-accent transition-colors">Concerts</a>
              <a href="/gallery" className="hover:text-accent transition-colors">Galerie</a>
              <a href="/spirituality" className="hover:text-accent transition-colors">Spiritualité</a>
              <a href="/contact" className="hover:text-accent transition-colors">Contact</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-light/20 mt-8 pt-8 text-center text-light/60">
          <p>&copy; 2003 - {currentYear} C.A.S.T. - Chœur Artistique & Spirituel de Tanà. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
'@
[System.IO.File]::WriteAllText("$PWD/src/components/layout/Footer.jsx", $footerJsx, $utf8NoBom)
Write-Host "✅ src/components/layout/Footer.jsx créé" -ForegroundColor Green

# 14. PAGE D'ACCUEIL
Write-Host "`n📄 Création de src/pages/public/Home.jsx..." -ForegroundColor Yellow
$homeJsx = @'
import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section avec ton image */}
      <section className="relative h-screen bg-gradient-to-br from-primary/90 to-dark/90 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/photo-choeur.jpeg")',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="absolute inset-0 bg-primary/70"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl fade-in">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Quand l'art devient prière,
              <span className="text-accent block">la musique touche l'âme</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Fondé en 2003 à Antananarivo, le C.A.S.T. est un ensemble vocal dont l'essence 
              repose sur le souffle sacré de la musique.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.href = '/about'}
                className="bg-accent text-primary px-8 py-4 rounded-lg font-semibold hover:bg-accent/90 transition-colors text-lg"
              >
                Découvrir le Chœur
              </button>
              <button 
                onClick={() => window.location.href = '/events'}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-dark transition-colors text-lg"
              >
                Prochains Concerts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section In Memoriam */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-dark mb-4">
                In Memoriam
              </h2>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <img 
                  src="/lucien-emmanuel.png" 
                  alt="Lucien Emmanuel RANDRIANARIVELO"
                  className="w-32 h-32 rounded-full object-cover border-4 border-accent shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="logo-fallback w-32 h-32 bg-primary text-white rounded-full border-4 border-accent flex items-center justify-center text-4xl shadow-lg">
                  🙏
                </div>
                <div>
                  <h3 className="font-serif text-3xl text-primary mb-2">
                    Lucien Emmanuel RANDRIANARIVELO (†)
                  </h3>
                  <p className="text-dark/60 italic">Orfèvre du sacré</p>
                </div>
              </div>
              
              <div className="space-y-4 text-dark/80 leading-relaxed">
                <p>
                  À l'image d'un orfèvre du sacré, il a patiemment transcrit les partitions complexes 
                  en grilles solfa accessibles, offrant à chaque choriste le don de compréhension.
                </p>
                
                <p>
                  Mais sa mission allait plus loin : il a offert une âme malgache aux chefs-d'œuvre 
                  classiques, traduisant leurs paroles avec délicatesse, fidélité et spiritualité.
                </p>
                
                <blockquote className="border-l-4 border-accent pl-6 italic text-dark/70 my-6 text-lg">
                  "Misaotra anao, Raiamandreny. Ianao no nandika sy nandray ny feon'ny lanitra 
                  ho tenin'ny tanindrazana."
                </blockquote>
                
                <p className="text-dark/60 text-center">
                  Son héritage est immatériel, mais palpable à chaque instant, dans chaque vibration du chœur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Répertoire */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-dark mb-4">
              Notre Répertoire
            </h2>
            <p className="text-xl text-dark/70 max-w-2xl mx-auto">
              Un voyage musical entre chefs-d'œuvre classiques et compositions malgaches sacrées
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Œuvres classiques */}
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
              <h3 className="font-serif text-2xl text-primary mb-4">Œuvres Classiques</h3>
              <ul className="space-y-2 text-dark/70">
                <li>• Messiah (Händel)</li>
                <li>• Requiem (Mozart)</li>
                <li>• La Création (Haydn)</li>
                <li>• Ode à la Joie (Beethoven)</li>
                <li>• Gloria in excelsis Deo</li>
              </ul>
            </div>

            {/* Œuvres malgaches */}
            <div className="bg-accent/5 p-6 rounded-2xl border border-accent/20">
              <h3 className="font-serif text-2xl text-secondary mb-4">Œuvres Malgaches</h3>
              <ul className="space-y-2 text-dark/70">
                <li>• Tompo ô, indrisy</li>
                <li>• Ny feonay</li>
                <li>• Chants traditionnels</li>
                <li>• Compositions originales</li>
                <li>• Polyphonies sacrées</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
'@
[System.IO.File]::WriteAllText("$PWD/src/pages/public/Home.jsx", $homeJsx, $utf8NoBom)
Write-Host "✅ src/pages/public/Home.jsx créé" -ForegroundColor Green

# Installation des dépendances
Write-Host "`n📦 Installation des dépendances..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dépendances installées avec succès!" -ForegroundColor Green
    
    Write-Host "`n🎉 PROJET CRÉÉ AVEC SUCCÈS!" -ForegroundColor Magenta
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "🚀 Lancement du serveur de développement..." -ForegroundColor Yellow
    Write-Host "📍 Le site sera disponible sur: http://localhost:3000" -ForegroundColor Green
    
    # Démarrer le serveur
    npm run dev
} else {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
}