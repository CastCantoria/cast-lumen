Write-Host "🔧 CORRECTION DE TOUS LES IMPORTS..." -ForegroundColor Cyan

# Fichiers à corriger pour eventsService
$eventsFiles = @(
    "src/components/events/EventBooking.jsx",
    "src/components/admin/AdminBookings.jsx",
    "src/components/admin/AdminEventForm.jsx",
    "src/components/admin/AdminEventList.jsx",
    "src/components/events/EventsList.jsx",
    "src/components/events/EventsCalendar.jsx"
)

# Fichiers à corriger pour repertoireService
$repertoireFiles = @(
    "src/components/repertoire/RepertoireItem.jsx",
    "src/components/repertoire/AddRepertoire.jsx",
    "src/components/repertoire/RepertoireList.jsx",
    "src/components/repertoire/RepertoireFilters.jsx"
)

$correctedCount = 0
$skippedCount = 0
$missingCount = 0

function Corriger-Import {
    param (
        [string[]]$fichiers,
        [string]$serviceNom,
        [string]$cheminCorrect
    )

    Write-Host "`n📁 CORRECTION $serviceNom..." -ForegroundColor Yellow

    foreach ($file in $fichiers) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw

            # Corriger les imports avec ou sans accolades
            $pattern1 = "import\s+\{\s*$serviceNom\s*\}\s*from\s+['""][\.\/a-zA-Z0-9_-]*services\/$serviceNom['""]"
            $pattern2 = "import\s+$serviceNom\s*from\s+['""][\.\/a-zA-Z0-9_-]*services\/$serviceNom['""]"

            $newContent = $content -replace $pattern1, "import $serviceNom from `"$cheminCorrect`""
            $newContent = $newContent -replace $pattern2, "import $serviceNom from `"$cheminCorrect`""

            if ($content -ne $newContent) {
                Set-Content $file $newContent
                Write-Host "✅ Corrigé: $file" -ForegroundColor Green
                $global:correctedCount++
            } else {
                Write-Host "✓ Déjà bon: $file" -ForegroundColor Blue
                $global:skippedCount++
            }
        } else {
            Write-Host "❌ Fichier manquant: $file" -ForegroundColor Red
            $global:missingCount++
        }
    }
}

Corriger-Import -fichiers $eventsFiles -serviceNom "eventsService" -cheminCorrect "../../services/eventsService"
Corriger-Import -fichiers $repertoireFiles -serviceNom "repertoireService" -cheminCorrect "../../services/repertoireService"

Write-Host "`n✨ CORRECTION TERMINÉE" -ForegroundColor Cyan
Write-Host "✅ Fichiers corrigés : $correctedCount" -ForegroundColor Green
Write-Host "✓ Fichiers déjà corrects : $skippedCount" -ForegroundColor Blue
Write-Host "❌ Fichiers introuvables : $missingCount" -ForegroundColor Red
Write-Host "`n🚀 Redémarrez Vite avec : npm run dev" -ForegroundColor Cyan