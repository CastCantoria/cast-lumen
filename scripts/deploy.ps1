# scripts/deploy.ps1 - Script de déploiement Vercel
Write-Host "?? Déploiement sur Vercel..." -ForegroundColor Green

# Build l'application
Write-Host "?? Construction de l'application..." -ForegroundColor Yellow
.\scripts\build.ps1

if ($LASTEXITCODE -ne 0) {
    Write-Host "? Build échoué, arrêt du déploiement" -ForegroundColor Red
    exit 1
}

# Vérifier si Vercel CLI est installé
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Vercel CLI non installé"
    }
    Write-Host "? Vercel CLI: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "? Vercel CLI non installé. Installation..." -ForegroundColor Yellow
    npm install -g vercel
}

# Déployer
Write-Host "?? Déploiement en cours..." -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "?? Déploiement réussi !" -ForegroundColor Green
} else {
    Write-Host "? Erreur lors du déploiement" -ForegroundColor Red
}
