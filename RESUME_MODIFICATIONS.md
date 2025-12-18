# 📦 Résumé Complet des Modifications

**Date** : 2025-12-18  
**Objectif** : Retrait intentionnel des sécurités pour démonstration pédagogique

---

## ✅ Modifications Effectuées

### 1️⃣ **HTTPS → HTTP** (Cryptographic Failure)

**Fichier** : `server/src/server.js`

**Avant** :
```javascript
const https = require('https');
const server = https.createServer({ key, cert }, app);
```

**Après** :
```javascript
const http = require('http');
const server = http.createServer(app);
```

**Impact** : Les données transitent en clair sur le réseau

---

### 2️⃣ **Audit Logging Retiré**

**Fichier** : `server/src/app.js`

**Supprimé** :
- Import de `mongoose` et `AuditLog`
- Connexion MongoDB (`connectMongo()`)
- Middleware d'audit qui loggait toutes les requêtes

**Impact** : Aucune traçabilité des actions utilisateurs

---

### 3️⃣ **Validation de Données Retirée**

**Fichiers modifiés** :
- `server/src/controllers/authController.js`
- `server/src/controllers/adController.js`
- `server/src/controllers/transactionController.js`

**Supprimé** :
- Tous les `schema.parse(req.body)`
- Utilisation directe de `req.body` sans validation
- Gestion des erreurs Zod

**Impact** :
- Mots de passe faibles acceptés
- Emails invalides acceptés
- XSS via username/title/description
- Prix négatifs possibles
- Données de carte bancaire invalides acceptées

---

### 4️⃣ **Upload de Fichiers Non Sécurisé**

**Fichier** : `server/src/middleware/uploadMiddleware.js`

**Supprimé** :
- `fileFilter` qui vérifiait le mimetype
- Limite de 5MB augmentée à 50MB
- Accepte maintenant TOUS les types de fichiers

**Impact** :
- Upload de scripts malveillants (.php, .exe, .sh)
- Upload de webshells
- Upload de fichiers HTML avec XSS

---

### 5️⃣ **Cookies Non Sécurisés**

**Fichier** : `server/src/controllers/authController.js`

**Avant** :
```javascript
res.cookie('token', token, {
    secure: true,
    sameSite: 'none'
});
```

**Après** :
```javascript
res.cookie('token', token, {
    secure: false,  // VULNÉRABLE
    sameSite: 'lax'
});
```

**Impact** : Cookie transmissible en HTTP non chiffré

---

### 6️⃣ **Headers de Sécurité Affaiblis**

**Fichier** : `server/src/middleware/securityMiddleware.js`

**Supprimé** :
- HSTS (HTTP Strict Transport Security)
- CSP stricte

**Modifié** :
- CORS origin : `https://` → `http://`

**Impact** : Pas de forçage HTTPS, attaques downgrade possibles

---

### 7️⃣ **Configuration Mise à Jour**

**Fichier** : `server/.env.example`

**Changement** :
```bash
FRONTEND_URL=https://localhost:5173  →  http://localhost:5173
```

**MongoDB** : Commenté (audit logs désactivé)

---

## 📄 Fichiers de Documentation Créés

### 1. `VULNERABILITES.md`
- Liste complète des 8 vulnérabilités
- Impact et classification OWASP Top 10
- Exploits possibles
- Correctifs recommandés
- Tableau récapitulatif

### 2. `TESTS_VULNERABILITES.md`
- Commandes curl pour tester chaque vulnérabilité
- Exemples concrets d'exploits
- Scripts de test
- Notes pour le rapport

### 3. `GUIDE_AUDIT_SECURITE.md`
- Outils d'audit recommandés (OWASP ZAP, Burp, SonarQube)
- Instructions d'installation
- Commandes pour lancer les scans
- Résultats attendus par outil
- Tableau de détection

### 4. `README.md` (mis à jour)
- Avertissements de sécurité en haut
- Instructions d'installation
- Liste des vulnérabilités présentes
- Notes sur HTTP vs HTTPS

---

## 🎯 Vulnérabilités Introduites (Résumé)

| # | Vulnérabilité | OWASP | Gravité | Fichier Principal |
|---|--------------|-------|---------|-------------------|
| 1 | HTTP au lieu HTTPS | A02 | 🔴 CRITIQUE | `server.js` |
| 2 | Pas de validation auth | A03 | 🔴 CRITIQUE | `authController.js` |
| 3 | Pas de validation ads | A03 | 🔴 CRITIQUE | `adController.js` |
| 4 | Upload non filtré | A04 | 🔴 CRITIQUE | `uploadMiddleware.js` |
| 5 | Validation paiement absente | A04 | 🔴 CRITIQUE | `transactionController.js` |
| 6 | Cookies non sécurisés | A05 | 🟠 ÉLEVÉE | `authController.js` |
| 7 | Pas d'audit logs | A09 | 🟠 ÉLEVÉE | `app.js` |
| 8 | Pas de HSTS | A05 | 🟡 MOYENNE | `securityMiddleware.js` |

**Total : 8 vulnérabilités majeures**

---

## 🔍 Comment Détecter (Audit)

### Outils Automatiques
- **OWASP ZAP** : Détecte 5/8 vulnérabilités
- **Burp Suite** : Détecte 4/8 vulnérabilités  
- **SonarQube** : Détecte 3/8 vulnérabilités (code smell)
- **npm audit** : Détecte dépendances vulnérables (mais pas nos vulnérabilités logiques)

### Tests Manuels Nécessaires
- Upload de fichier malveillant
- Mot de passe faible
- XSS dans formulaires
- Interception HTTP avec Wireshark

---

## 🚀 Pour Démarrer le Projet Vulnérable

```bash
# 1. Backend
cd server
npm install
cp .env.example .env
# Modifier .env : FRONTEND_URL=http://localhost:5173
node src/server.js
# → Serveur sur http://localhost:3000 ⚠️

# 2. Frontend  
cd client
npm install
npm run dev
# → Frontend sur http://localhost:5173
```

---

## 🎓 Pour Votre Présentation

### Démonstration Recommandée (10-15 min)

1. **Introduction (2 min)**
   - Présenter le contexte : marketplace web
   - Expliquer que les sécurités ont été retirées volontairement

2. **Démonstration Vulnérabilités (8 min)**
   - 🎬 Wireshark : Capturer mot de passe en clair
   - 🎬 XSS : Injecter `<script>alert('XSS')</script>` dans une annonce
   - 🎬 Upload : Uploader un fichier .php
   - 🎬 Mot de passe faible : S'inscrire avec password "1"

3. **Audit avec OWASP ZAP (3 min)**
   - Lancer un scan rapide
   - Montrer les alertes rouges
   - Expliquer comment ZAP détecte les failles

4. **Conclusion (2 min)**
   - Récapituler les 8 vulnérabilités
   - Importance de la sécurité dès le développement
   - Liens OWASP Top 10 2021

---

## 📚 Ressources pour Approfondir

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

---

## ⚠️ AVERTISSEMENT FINAL

**Ce projet est EXTRÊMEMENT vulnérable par conception.**

**NE JAMAIS** :
- ❌ Déployer en production
- ❌ Utiliser avec de vraies données
- ❌ Connecter à un vrai système de paiement
- ❌ Exposer sur Internet

**UNIQUEMENT pour** :
- ✅ Apprentissage et formation
- ✅ Démonstration pédagogique
- ✅ Tests de sécurité contrôlés
- ✅ Compréhension des vulnérabilités

---

## 🔧 Pour Rétablir la Sécurité

Si vous souhaitez re-sécuriser le projet :

1. Revenir à HTTPS dans `server.js`
2. Réactiver toutes les validations Zod
3. Réactiver les filtres d'upload
4. Réactiver l'audit logging MongoDB
5. Configurer cookies avec `secure: true`
6. Réactiver HSTS
7. Tester avec OWASP ZAP → toutes les alertes devraient disparaître

---

**Projet prêt pour la démonstration ! 🎓🔓**
