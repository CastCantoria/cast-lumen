@echo off
chcp 65001 >nul
title C.A.S.T. Lumen - Commandes Rapides

:menu
cls
echo.
echo ========================================
echo    C.A.S.T. LUMEN - COMMANDES RAPIDES
echo ========================================
echo.
echo 1. Mode Développement
echo 2. Build Production 
echo 3. Déploiement Vercel
echo 4. Nettoyage Projet
echo 5. Installation Dépendances
echo 6. Initialisation Projet
echo 7. Quitter
echo.
set /p choice="Choisissez une option (1-7): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto build
if "%choice%"=="3" goto deploy
if "%choice%"=="4" goto clean
if "%choice%"=="5" goto install
if "%choice%"=="6" goto init
if "%choice%"=="7" goto exit

echo Option invalide
pause
goto menu

:dev
echo Démarrage du mode développement...
powershell -File scripts\dev.ps1
pause
goto menu

:build
echo Construction de l'application...
powershell -File scripts\build.ps1
pause
goto menu

:deploy
echo Déploiement sur Vercel...
powershell -File scripts\deploy.ps1
pause
goto menu

:clean
echo Nettoyage du projet...
powershell -File scripts\clean.ps1
pause
goto menu

:install
echo Installation des dépendances...
npm install
pause
goto menu

:init
echo Initialisation du projet...
powershell -File init-project.ps1
pause
goto menu

:exit
echo Au revoir !
pause
exit