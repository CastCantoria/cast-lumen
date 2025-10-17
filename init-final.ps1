# init-final.ps1 - Version finale sans problèmes d'encodage
param(
    [switch]$DevMode
)

# Configuration d'encodage
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🎵 Initialisation finale de C.A.S.T. Lumen..." -ForegroundColor Green

# Créer package.json manuellement avec encodage correct
$packageJsonContent = @'
{
  "name": "cast-lumen",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && vercel --prod",
    "dev-win": "powershell -File ./scripts/dev.ps1",
    "build-win": "powershell -File ./scripts/build.ps1",
    "deploy-win": "powershell -File ./scripts/deploy.ps1"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "firebase": "^10.7.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
'@

# Écrire le fichier sans BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$PWD/package.json", $packageJsonContent, $utf8NoBom)

Write-Host "✅ package.json créé sans BOM" -ForegroundColor Green

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
[System.IO.File]::WriteAllText("$PWD/vite.config.js", $viteConfig, $utf8NoBom)

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
[System.IO.File]::WriteAllText("$PWD/tailwind.config.js", $tailwindConfig, $utf8NoBom)

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
[System.IO.File]::WriteAllText("$PWD/src/lib/firebase.js", $firebaseConfig, $utf8NoBom)

# Fichier .env
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
[System.IO.File]::WriteAllText("$PWD/.env.example", $envContent, $utf8NoBom)

Write-Host "✅ Tous les fichiers créés avec encodage correct" -ForegroundColor Green

# Installer les dépendances
Write-Host "`n📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dépendances installées avec succès" -ForegroundColor Green
    
    # Démarrer le serveur de développement si demandé
    if ($DevMode) {
        Write-Host "`n🚀 Démarrage du serveur de développement..." -ForegroundColor Cyan
        npm run dev
    }
} else {
    Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
}