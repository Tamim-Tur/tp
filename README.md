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
---

## III) ✅ Sécurité et Corrections

Ce projet a été audité et sécurisé.
Toutes les vulnérabilités précédemment identifiées ont été corrigées :

| Vulnérabilité | Statut | Correction Appliquée |
|--------------|--------|---------------------|
| **HTTP non chiffré** | ✅ CORRIGÉ | Activation de HTTPS + HSTS |
| **Validation absente** | ✅ CORRIGÉ | Validation stricte avec Zod |
| **Upload non filtré** | ✅ CORRIGÉ | Whitelist extensions + limite taille |
| **Pas d'audit logs** | ✅ CORRIGÉ | Audit logging MongoDB activé |
| **XSS** | ✅ CORRIGÉ | Sanitization des entrées (xss) |
| **Cookies insécurisés** | ✅ CORRIGÉ | Secure + SameSite: Strict |

**Le projet est maintenant sécurisé et respecte les bonnes pratiques OWASP.**

---
