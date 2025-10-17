# fix-encoding.ps1 - Corriger l'encodage des fichiers
Write-Host "🔧 Correction de l'encodage des fichiers..." -ForegroundColor Yellow

# Liste des fichiers à corriger
$files = @(
    "package.json",
    "vite.config.js", 
    "tailwind.config.js",
    "src/main.jsx",
    "src/App.jsx",
    "src/pages/public/Home.jsx",
    "src/contexts/AuthContext.jsx",
    "src/lib/firebase.js",
    "src/styles/globals.css",
    ".env",
    ".env.example"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        # Lire le contenu et le réécrire sans BOM
        $content = Get-Content $file -Raw
        $content = $content -replace '^\uFEFF', ''  # Supprimer le BOM
        Out-File -FilePath $file -InputObject $content -Encoding UTF8 -NoNewline
        Write-Host "✅ Corrigé : $file" -ForegroundColor Green
    }
}

Write-Host "🎉 Correction terminée ! Redémarrez VS Code." -ForegroundColor Cyan