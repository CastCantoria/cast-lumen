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
