# fix-imports.ps1
Write-Host "🔧 CORRECTION DES IMPORTS eventsService..." -ForegroundColor Cyan

$files = @(
    "src/components/events/EventBooking.jsx",
    "src/components/admin/AdminBookings.jsx",
    "src/components/admin/AdminEventForm.jsx",
    "src/components/admin/AdminEventList.jsx",
    "src/components/events/EventsList.jsx",
    "src/components/events/EventsCalendar.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $newContent = $content -replace 'import\s+\{\s*eventsService\s*\}\s*from\s+["'']\.\.\/\.\.\/\.\.\/services\/eventsService["'']', 'import eventsService from "../../../services/eventsService"'
        
        if ($content -ne $newContent) {
            Set-Content $file $newContent
            Write-Host "✅ Corrigé: $file" -ForegroundColor Green
        } else {
            Write-Host "✓ Déjà bon: $file" -ForegroundColor Blue
        }
    } else {
        Write-Host "❌ Fichier manquant: $file" -ForegroundColor Red
    }
}

Write-Host "✨ CORRECTION TERMINÉE" -ForegroundColor Cyan