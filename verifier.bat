@echo off
REM Script de vérification du projet vulnérable
REM Windows PowerShell/CMD

echo.
echo ========================================
echo   VERIFICATION PROJET VULNERABLE
echo   TP Final - Efrei
echo ========================================
echo.

REM Vérifier Node.js
echo [1/5] Verification Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe!
    echo Telechargez-le sur https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js est installe
echo.

REM Vérifier npm
echo [2/5] Verification npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] npm n'est pas installe!
    pause
    exit /b 1
)
echo [OK] npm est installe
echo.

REM Vérifier les dépendances backend
echo [3/5] Verification dependances backend...
cd server
if not exist "node_modules" (
    echo [INFO] Installation des dependances backend...
    call npm install
)
echo [OK] Dependances backend presentes
cd ..
echo.

REM Vérifier les dépendances frontend
echo [4/5] Verification dependances frontend...
cd client
if not exist "node_modules" (
    echo [INFO] Installation des dependances frontend...
    call npm install
)
echo [OK] Dependances frontend presentes
cd ..
echo.

REM Vérifier .env
echo [5/5] Verification configuration...
cd server
if not exist ".env" (
    echo [ATTENTION] Fichier .env manquant!
    echo Creation depuis .env.example...
    copy .env.example .env
    echo.
    echo [ACTION REQUISE] Editez server\.env et configurez:
    echo   - DB_HOST, DB_NAME, DB_USER, DB_PASS (PostgreSQL)
    echo   - JWT_SECRET (cle secrete)
    echo   - FRONTEND_URL=http://localhost:5173
    echo.
)
cd ..
echo.

REM Résumé
echo ========================================
echo   RESUME
echo ========================================
echo.
echo [OK] Projet pret pour demonstration!
echo.
echo VULNERABILITES PRESENTES (intentionnelles):
echo   [1] HTTP au lieu de HTTPS
echo   [2] Pas de validation des donnees
echo   [3] Upload de fichiers non securise
echo   [4] Cookies non securises
echo   [5] Pas d'audit logs
echo   [6] Pas de HSTS
echo.
echo Pour demarrer:
echo   1. Backend:  cd server ^& node src/server.js
echo   2. Frontend: cd client ^& npm run dev
echo.
echo Documentation:
echo   - VULNERABILITES.md : Liste complete des failles
echo   - GUIDE_AUDIT_SECURITE.md : Comment les detecter
echo   - TESTS_VULNERABILITES.md : Tests a effectuer
echo.
echo ========================================
echo   /!\ AVERTISSEMENT SECURITE /!\
echo   NE JAMAIS DEPLOYER EN PRODUCTION
echo   Projet pedagogique uniquement
echo ========================================
echo.
pause
