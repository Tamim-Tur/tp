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

## III) ⚠️ Vulnérabilités Présentes

Ce projet contient les vulnérabilités suivantes (intentionnelles) :

| Vulnérabilité | Impact | Fichier |
|--------------|--------|---------|
| **HTTP au lieu HTTPS** | 🔴 Données en clair | `server/src/server.js` |
| **Pas de validation** | 🔴 XSS, Injection | `server/src/controllers/*.js` |
| **Upload non filtré** | 🔴 WebShell possible | `server/src/middleware/uploadMiddleware.js` |
| **Pas d'audit logs** | 🟠 Aucune traçabilité | `server/src/app.js` |

**Voir `VULNERABILITES.md` pour les détails complets.**

### ⚠️ Important : npm audit

Si vous exécutez `npm audit` et voyez **0 vulnérabilités**, c'est **NORMAL** !

`npm audit` ne détecte que les vulnérabilités dans les **packages npm** (dépendances), pas dans **votre code**.

**Les vulnérabilités de ce projet sont dans le CODE applicatif**, pas dans les dépendances.

**Pour les détecter, utilisez** :
- ✅ **OWASP ZAP** (scan de l'application)
- ✅ **Tests manuels** (voir `TESTS_VULNERABILITES.md`)
- ✅ **Wireshark** (pour HTTP non chiffré)

**Voir `NPM_AUDIT_EXPLICATION.md` pour plus de détails.**

---

## IV) Objectif Pédagogique

Ce projet démontre :
- ✅ L'importance du chiffrement HTTPS/TLS
- ✅ La nécessité de valider toutes les entrées utilisateur
- ✅ Les risques d'upload de fichiers non filtrés
- ✅ L'importance de l'audit et du logging

---

## V) Tests de Vulnérabilités

Pour tester les vulnérabilités :

1. **Interception HTTP** : Utilisez Wireshark pour voir les données en clair
2. **XSS** : Créez une annonce avec `<script>alert('XSS')</script>` dans le titre
3. **Upload malveillant** : Uploadez un fichier .php ou .exe
4. **Mot de passe faible** : Enregistrez un compte avec password "1"

---

**⚠️ RAPPEL : Ce projet est UNIQUEMENT à des fins éducatives. Ne jamais utiliser en production !**