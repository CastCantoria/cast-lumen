# init-project-fixed.ps1 - Version avec encodage UTF-8
param(
    [string]$ProjectName = "cast-lumen",
    [switch]$SetupFirebase,
    [switch]$DevMode
)

# Définir l'encodage UTF-8 pour PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🎵 Initialisation du projet C.A.S.T. Lumen..." -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan

# Fonction pour vérifier les prérequis
function Test-Prerequisites {
    Write-Host "`n🔍 Verification des prerequis..." -ForegroundColor Yellow
    
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
                throw "Non installe"
            }
        } catch {
            Write-Host "❌ $($req.Name) : Non installe" -ForegroundColor Red
            return $false
        }
    }
    return $true
}

# Fonction pour créer la structure de dossiers
function New-ProjectStructure {
    Write-Host "`n📁 Creation de la structure du projet..." -ForegroundColor Yellow
    
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
            Write-Host "📂 Cree : $folder" -ForegroundColor Blue
        }
    }
}

# Fonction pour créer les fichiers de configuration
function New-ConfigFiles {
    Write-Host "`n⚙️  Creation des fichiers de configuration..." -ForegroundColor Yellow
    
    # package.json
    $packageJson = @{
        name = $ProjectName
        private = $true
        version = "1.0.0"
        type = "module"
        scripts = @{
            "dev" = "vite"
            "build" = "vite build"
            "preview" = "vite preview"
            "deploy" = "vite build && vercel --prod"
            "lint" = "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
            "dev-win" = "powershell -File ./scripts/dev.ps1"
            "build-win" = "powershell -File ./scripts/build.ps1"
            "deploy-win" = "powershell -File ./scripts/deploy.ps1"
        }
        dependencies = @{
            "react" = "^18.2.0"
            "react-dom" = "^18.2.0"
            "react-router-dom" = "^6.20.1"
            "firebase" = "^10.7.1"
        }
        devDependencies = @{
            "@types/react" = "^18.2.43"
            "@types/react-dom" = "^18.2.17"
            "@vitejs/plugin-react" = "^4.2.1"
            "autoprefixer" = "^10.4.16"
            "postcss" = "^8.4.32"
            "tailwindcss" = "^3.3.6"
            "vite" = "^5.0.8"
        }
    }
    
    $packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8
    Write-Host "📄 Cree : package.json" -ForegroundColor Blue
    
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
    Out-File -FilePath "vite.config.js" -InputObject $viteConfig -Encoding UTF8
    Write-Host "📄 Cree : vite.config.js" -ForegroundColor Blue
    
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
    Out-File -FilePath "tailwind.config.js" -InputObject $tailwindConfig -Encoding UTF8
    Write-Host "📄 Cree : tailwind.config.js" -ForegroundColor Blue
}

# Fonction pour créer les fichiers essentiels
function New-EssentialFiles {
    Write-Host "`n📝 Creation des fichiers essentiels..." -ForegroundColor Yellow
    
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
    Out-File -FilePath "src/main.jsx" -InputObject $mainJsx -Encoding UTF8
    
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
              <Route path="/about" element={<div className="container mx-auto px-4 py-20">A Propos - En construction</div>} />
              <Route path="/repertoire" element={<div className="container mx-auto px-4 py-20">Repertoire - En construction</div>} />
              <Route path="/events" element={<div className="container mx-auto px-4 py-20">Concerts - En construction</div>} />
              <Route path="/gallery" element={<div className="container mx-auto px-4 py-20">Galerie - En construction</div>} />
              <Route path="/spirituality" element={<div className="container mx-auto px-4 py-20">Spiritualite - En construction</div>} />
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
    Out-File -FilePath "src/App.jsx" -InputObject $appJsx -Encoding UTF8
    
    # Home page (simplifiée sans caractères spéciaux problématiques)
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
              Quand l'art devient priere,
              <span className="text-accent block">la musique touche l'ame</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-light/90 leading-relaxed">
              Fonde en 2003 a Antananarivo, le C.A.S.T. est un ensemble vocal dont l'essence 
              repose sur le souffle sacre de la musique.
            </p>
            
            <div className="flex space-x-4">
              <button className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                Decouvrir le Choeur
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
                A l'image d'un orfevre du sacre, il a patiemment transcrit les partitions complexes 
                en grilles solfa accessibles, offrant a chaque choriste le don de comprehension.
              </p>
              
              <p className="text-dark/80 mb-6 leading-relaxed">
                Mais sa mission allait plus loin : il a offert une ame malgache aux chefs-d'oeuvre 
                classiques, traduisant leurs paroles avec delicatesse, fidelite et spiritualite.
              </p>
              
              <blockquote className="border-l-4 border-accent pl-4 italic text-dark/70 mb-6">
                "Misaotra anao, Raiamandreny. Ianao no nandika sy nandray ny feon'ny lanitra 
                ho tenin'ny tanindrazana."
              </blockquote>
              
              <p className="text-dark/60">
                Son heritage est immateriel, mais palpable a chaque instant, dans chaque vibration du choeur.
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
    Out-File -FilePath "src/pages/public/Home.jsx" -InputObject $homePage -Encoding UTF8
    
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
    Out-File -FilePath "src/contexts/AuthContext.jsx" -InputObject $authContext -Encoding UTF8
    
    # Firebase config avec TES paramètres
    $firebaseConfig = @'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCT_8j9KBKgcYr3naOFRp-Kk-s-gr_A1gs",
  authDomain: "cast-84d3f.firebaseapp.com",
  projectId: "cast-84d3f",
  storageBucket: "cast-84d3f.firebasestorage.app",
  messagingSenderId: "160422742820",
  appId: "1:160422742820:web:f60e6c94ba743d1afd41b1",
  measurementId: "G-9BNSYK4TH4"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export default app
'@
    Out-File -FilePath "src/lib/firebase.js" -InputObject $firebaseConfig -Encoding UTF8
    
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
    Out-File -FilePath "src/styles/globals.css" -InputObject $globalCss -Encoding UTF8
    
    # Environment template avec TES valeurs
    $envContent = @'
VITE_FIREBASE_API_KEY=AIzaSyCT_8j9KBKgcYr3naOFRp-Kk-s-gr_A1gs
VITE_FIREBASE_AUTH_DOMAIN=cast-84d3f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cast-84d3f
VITE_FIREBASE_STORAGE_BUCKET=cast-84d3f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=160422742820
VITE_FIREBASE_APP_ID=1:160422742820:web:f60e6c94ba743d1afd41b1
VITE_FIREBASE_MEASUREMENT_ID=G-9BNSYK4TH4
'@
    Out-File -FilePath ".env" -InputObject $envContent -Encoding UTF8
    Out-File -FilePath ".env.example" -InputObject $envContent -Encoding UTF8
    
    Write-Host "✅ Tous les fichiers essentiels crees" -ForegroundColor Green
}

# Fonction pour installer les dépendances
function Install-Dependencies {
    Write-Host "`n📦 Installation des dependances..." -ForegroundColor Yellow
    
    # Vérifier si node_modules existe déjà
    if (Test-Path "node_modules") {
        $choice = Read-Host "node_modules existe deja. Voulez-vous le supprimer et reinstaller ? (y/N)"
        if ($choice -eq 'y') {
            Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
        } else {
            Write-Host "⏩ Installation des dependances ignoree" -ForegroundColor Yellow
            return
        }
    }
    
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependances installees avec succes" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors de l'installation des dependances" -ForegroundColor Red
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
    Out-File -FilePath "firebase/firestore.rules" -InputObject $firebaseRules -Encoding UTF8
    
    Write-Host "✅ Configuration Firebase creee" -ForegroundColor Green
}

# Fonction pour créer les scripts utilitaires
function New-UtilityScripts {
    Write-Host "`n🔧 Creation des scripts utilitaires..." -ForegroundColor Yellow
    
    # Script de développement
    $devScript = @'
# scripts/dev.ps1 - Script de developpement
Write-Host "🚀 Demarrage du serveur de developpement..." -ForegroundColor Green

# Verifier si .env existe
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Fichier .env non trouve. Copie depuis .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
}

# Demarrer Vite
Write-Host "🎵 Serveur C.A.S.T. Lumen demarre sur http://localhost:3000" -ForegroundColor Cyan
npm run dev
'@
    Out-File -FilePath "scripts/dev.ps1" -InputObject $devScript -Encoding UTF8
    
    # Script de build
    $buildScript = @'
# scripts/build.ps1 - Script de build de production
Write-Host "🔨 Construction de l'application..." -ForegroundColor Green

# Verifier les variables d'environnement
if (!(Test-Path ".env")) {
    Write-Host "❌ Fichier .env non trouve. Veuillez le creer a partir de .env.example" -ForegroundColor Red
    exit 1
}

# Build avec Vite
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build termine avec succes !" -ForegroundColor Green
    Write-Host "📁 Dossier de build : ./dist" -ForegroundColor Blue
} else {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}
'@
    Out-File -FilePath "scripts/build.ps1" -InputObject $buildScript -Encoding UTF8
    
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
        Write-Host "🗑️  Supprime: $item" -ForegroundColor Blue
    }
}

Write-Host "✅ Nettoyage termine" -ForegroundColor Green
'@
    Out-File -FilePath "scripts/clean.ps1" -InputObject $cleanScript -Encoding UTF8
    
    Write-Host "✅ Scripts utilitaires crees" -ForegroundColor Green
}

# Fonction principale
function Main {
    Write-Host "`n🎵 INITIALISATION CAST LUMEN" -ForegroundColor Magenta
    Write-Host "=============================" -ForegroundColor Cyan
    
    # Vérifier les prérequis
    if (!(Test-Prerequisites)) {
        Write-Host "`n❌ Prerequis manquants. Veuillez installer les logiciels requis." -ForegroundColor Red
        exit 1
    }
    
    # Créer la structure
    New-ProjectStructure
    
    # Créer les fichiers de configuration
    New-ConfigFiles
    
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
    Write-Host "`n🎉 PROJET CAST LUMEN INITIALISE AVEC SUCCES !" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Cyan
    
    Write-Host "`n📋 Prochaines etapes :" -ForegroundColor Yellow
    Write-Host "1. Firebase est deja configure avec ton projet !" -ForegroundColor White
    Write-Host "2. Lance le developpement: npm run dev-win" -ForegroundColor White  
    Write-Host "3. Ouvre http://localhost:3000" -ForegroundColor White
    Write-Host "4. Commence a developper !" -ForegroundColor White
    
    Write-Host "`n🚀 Commandes disponibles :" -ForegroundColor Cyan
    Write-Host "   npm run dev-win     - Mode developpement" -ForegroundColor Gray
    Write-Host "   npm run build-win   - Build production" -ForegroundColor Gray
    Write-Host "   .\scripts\clean.ps1 - Nettoyage du projet" -ForegroundColor Gray
    
    if ($DevMode) {
        Write-Host "`n🔧 Mode developpement active - Demarrage du serveur..." -ForegroundColor Green
        Start-Sleep -Seconds 2
        .\scripts\dev.ps1
    }
}

# Exécution du script
Main