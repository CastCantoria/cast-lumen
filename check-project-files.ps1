# check-project-files.ps1
# Script de vérification automatique des fichiers du projet CAST LUMEN

Write-Host "🔍 VÉRIFICATION DU PROJET CAST LUMEN" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Fonction pour vérifier la syntaxe d'un fichier JSX/JS
function Test-FileSyntax {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "❌ MANQUANT: $FilePath" -ForegroundColor Red
        return $false
    }
    
    try {
        $content = Get-Content $FilePath -Raw
        
        # Vérifications basiques de syntaxe
        $errors = @()
        
        # Vérifier les accolades équilibrées
        $openBraces = ($content | Select-String -Pattern '\{' -AllMatches).Matches.Count
        $closeBraces = ($content | Select-String -Pattern '\}' -AllMatches).Matches.Count
        if ($openBraces -ne $closeBraces) {
            $errors += "Accolades déséquilibrées ($openBraces/{ vs $closeBraces/})"
        }
        
        # Vérifier les parenthèses équilibrées
        $openParens = ($content | Select-String -Pattern '\(' -AllMatches).Matches.Count
        $closeParens = ($content | Select-String -Pattern '\)' -AllMatches).Matches.Count
        if ($openParens -ne $closeParens) {
            $errors += "Parenthèses déséquilibrées ($openParens/( vs $closeParens/))"
        }
        
        # Vérifier les imports React
        if ($content -match 'from\s+["''].*\.jsx["'']') {
            $errors += "Import avec extension .jsx détecté (doit être sans extension)"
        }
        
        # Vérifier export default
        if (-not ($content -match 'export default')) {
            $errors += "Export default manquant"
        }
        
        if ($errors.Count -gt 0) {
            Write-Host "⚠️  PROBLÈME: $FilePath" -ForegroundColor Yellow
            foreach ($err in $errors) {
                Write-Host "   - $err" -ForegroundColor Yellow
            }
            return $false
        } else {
            Write-Host "✅ VALIDE: $FilePath" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ ERREUR LECTURE: $FilePath - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Fonction pour créer un fichier minimal de secours
function Create-BackupFile {
    param([string]$FilePath, [string]$ComponentName)
    
    $content = @"
import React from 'react';

const $ComponentName = () => {
  return (
    <div>
      <h3>$ComponentName</h3>
      <p>Composant chargé avec succès - Version minimaliste</p>
    </div>
  );
};

export default $ComponentName;
"@
    
    try {
        $dir = Split-Path $FilePath -Parent
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force
        }
        Set-Content -Path $FilePath -Value $content
        Write-Host "📝 CRÉÉ: $FilePath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ ERREUR CRÉATION: $FilePath - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# FICHIERS CRITIQUES À VÉRIFIER
$criticalFiles = @(
    # Services
    @{Path = "src/services/eventsService.js"; Component = "eventsService"},
    @{Path = "src/services/repertoireService.js"; Component = "repertoireService"},
    @{Path = "src/services/emailService.js"; Component = "emailService"},
    
    # Composants Admin
    @{Path = "src/components/admin/AdminEventList.jsx"; Component = "AdminEventList"},
    @{Path = "src/components/admin/AdminEventForm.jsx"; Component = "AdminEventForm"},
    @{Path = "src/components/admin/AdminBookings.jsx"; Component = "AdminBookings"},
    @{Path = "src/components/admin/AdminEventBookings.jsx"; Component = "AdminEventBookings"},
    
    # Composants Events
    @{Path = "src/components/events/EventsCalendar.jsx"; Component = "EventsCalendar"},
    @{Path = "src/components/events/EventsList.jsx"; Component = "EventsList"},
    @{Path = "src/components/events/EventBooking.jsx"; Component = "EventBooking"},
    @{Path = "src/components/events/EventDetails.jsx"; Component = "EventDetails"},
    
    # Composants Repertoire
    @{Path = "src/components/repertoire/RepertoireList.jsx"; Component = "RepertoireList"},
    @{Path = "src/components/repertoire/RepertoireItem.jsx"; Component = "RepertoireItem"},
    @{Path = "src/components/repertoire/RepertoireFilters.jsx"; Component = "RepertoireFilters"},
    @{Path = "src/components/repertoire/AddRepertoire.jsx"; Component = "AddRepertoire"},
    
    # Fichiers de configuration
    @{Path = "src/config/firebase.js"; Component = "firebaseConfig"},
    @{Path = "src/config/emailConfig.js"; Component = "emailConfig"}
)

# FICHIERS CSS MANQUANTS
$cssFiles = @(
    "src/admin/EventsAdmin.css",
    "src/components/admin/AdminEventForm.css",
    "src/components/admin/AdminBookings.css",
    "src/components/events/EventsCalendar.css",
    "src/components/events/EventsList.css",
    "src/components/events/EventBooking.css",
    "src/components/repertoire/RepertoireList.css",
    "src/components/repertoire/RepertoireItem.css",
    "src/components/repertoire/RepertoireFilters.css",
    "src/components/repertoire/AddRepertoire.css"
)

Write-Host "`n📁 VÉRIFICATION DES FICHIERS CRITIQUES" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$problematicFiles = @()
$missingFiles = @()

foreach ($file in $criticalFiles) {
    $isValid = Test-FileSyntax -FilePath $file.Path
    if (-not $isValid) {
        $problematicFiles += $file.Path
        if (-not (Test-Path $file.Path)) {
            $missingFiles += $file
        }
    }
}

Write-Host "`n🎨 VÉRIFICATION DES FICHIERS CSS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$missingCssFiles = @()
foreach ($cssFile in $cssFiles) {
    if (-not (Test-Path $cssFile)) {
        Write-Host "❌ MANQUANT: $cssFile" -ForegroundColor Red
        $missingCssFiles += $cssFile
    } else {
        Write-Host "✅ PRÉSENT: $cssFile" -ForegroundColor Green
    }
}

# RAPPORT FINAL
Write-Host "`n📊 RAPPORT DE VÉRIFICATION" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan

if ($problematicFiles.Count -eq 0 -and $missingCssFiles.Count -eq 0) {
    Write-Host "🎉 TOUS LES FICHIERS SONT VALIDES !" -ForegroundColor Green
} else {
    if ($problematicFiles.Count -gt 0) {
        Write-Host "`n❌ FICHIERS AVEC PROBLÈMES:" -ForegroundColor Red
        foreach ($file in $problematicFiles) {
            Write-Host "   - $file" -ForegroundColor Red
        }
    }
    
    if ($missingFiles.Count -gt 0) {
        Write-Host "`n📝 FICHIERS MANQUANTS:" -ForegroundColor Yellow
        foreach ($file in $missingFiles) {
            Write-Host "   - $($file.Path)" -ForegroundColor Yellow
        }
    }
    
    if ($missingCssFiles.Count -gt 0) {
        Write-Host "`n🎨 FICHIERS CSS MANQUANTS:" -ForegroundColor Yellow
        foreach ($file in $missingCssFiles) {
            Write-Host "   - $file" -ForegroundColor Yellow
        }
    }
    
    # PROPOSITION DE CORRECTION AUTOMATIQUE
    if ($missingFiles.Count -gt 0) {
        Write-Host "`n🔧 CORRECTION AUTOMATIQUE DISPONIBLE" -ForegroundColor Cyan
        $choice = Read-Host "Voulez-vous créer les fichiers manquants ? (O/N)"
        if ($choice -eq 'O' -or $choice -eq 'o') {
            Write-Host "`n📦 CRÉATION DES FICHIERS MANQUANTS..." -ForegroundColor Cyan
            foreach ($file in $missingFiles) {
                Create-BackupFile -FilePath $file.Path -ComponentName $file.Component
            }
            Write-Host "✅ CORRECTION TERMINÉE !" -ForegroundColor Green
        }
    }
}

# VÉRIFICATION DES IMPORTS DANS EventsAdmin.jsx
Write-Host "`n🔍 VÉRIFICATION DES IMPORTS DANS EventsAdmin.jsx" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

if (Test-Path "src/admin/EventsAdmin.jsx") {
    $eventsAdminContent = Get-Content "src/admin/EventsAdmin.jsx" -Raw
    
    # Vérifier les imports problématiques
    $problematicImports = @()
    
    if ($eventsAdminContent -match 'import\([^)]+\.jsx["'']\)') {
        $problematicImports += "Import dynamique avec .jsx détecté"
    }
    
    if ($eventsAdminContent -match 'from\s+["''].*\.jsx["'']') {
        $problematicImports += "Import statique avec extension .jsx"
    }
    
    # Vérifier les imports spécifiques
    $requiredImports = @(
        'AdminEventList',
        'AdminEventForm', 
        'AdminBookings',
        'eventsService'
    )
    
    foreach ($import in $requiredImports) {
        if (-not ($eventsAdminContent -match "import.*$import")) {
            $problematicImports += "Import manquant: $import"
        }
    }
    
    if ($problematicImports.Count -eq 0) {
        Write-Host "✅ IMPORTS VALIDES DANS EventsAdmin.jsx" -ForegroundColor Green
    } else {
        Write-Host "❌ PROBLÈMES D'IMPORT DANS EventsAdmin.jsx:" -ForegroundColor Red
        foreach ($issue in $problematicImports) {
            Write-Host "   - $issue" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ EventsAdmin.jsx NON TROUVÉ" -ForegroundColor Red
}

Write-Host "`n✨ VÉRIFICATION TERMINÉE" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan