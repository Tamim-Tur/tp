# ⚠️ PROJET PÉDAGOGIQUE - VULNÉRABILITÉS INTENTIONNELLES

> **🚨 AVERTISSEMENT IMPORTANT 🚨**  
> Ce projet contient des **vulnérabilités de sécurité intentionnelles** à des fins pédagogiques.  
> **NE JAMAIS déployer ce code en production !**  
> Consultez `VULNERABILITES.md` pour la liste complète des failles de sécurité.

---

## I) Installation

Pour cloner ce projet, utilisez la commande suivante :

```bash
git clone git@github.com:Tamim-Tur/tp.git
```

### Client (Frontend)

Ensuite, dans le dossier client :
```bash
cd client
npm install
```

### Server (Backend)

Dans le dossier server :
```bash
cd server
npm install
```

Il se peut qu'un package supplémentaire soit nécessaire pour le serveur, dans ce cas :
```bash
npm install cookie-parser
```

> ⚠️ **Important :** Copiez le fichier `.env.example` et renommez la copie en `.env`. Modifiez les variables d'environnement dans le fichier `.env` selon vos besoins.

**Note**: Le serveur utilise maintenant **HTTP** au lieu de HTTPS. Assurez-vous que `FRONTEND_URL` dans `.env` utilise `http://` et non `https://`.

---

## II) Démarrage

### Frontend
Pour démarrer le front, exécutez la commande suivante dans le dossier client :
```bash
npm run dev
```
Le frontend sera accessible sur **http://localhost:5173**

### Backend
Pour démarrer le back, exécutez la commande suivante dans le dossier server :
```bash
node src/server.js
```
Le serveur sera accessible sur **http://localhost:3000**

---
