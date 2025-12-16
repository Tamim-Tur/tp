@echo off
echo Lancement du projet CoinCoin...

:: Lancer le serveur dans une nouvelle fenetre
start "Serveur CoinCoin" cmd /k "cd server && npm install && node src/server.js"

:: Attendre un peu que le serveur demarre
timeout /t 5

:: Lancer le client dans une nouvelle fenetre
start "Client CoinCoin" cmd /k "cd client && npm install && npm run dev"

echo Tout est lance !
echo Serveur: http://localhost:3000
echo Client: http://localhost:5173
