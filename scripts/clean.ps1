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
