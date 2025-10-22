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
