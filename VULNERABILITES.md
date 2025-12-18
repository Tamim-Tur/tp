# 🔓 VULNÉRABILITÉS INTRODUITES - RAPPORT PÉDAGOGIQUE

> ⚠️ **ATTENTION**: Ce projet contient des vulnérabilités intentionnelles à des fins pédagogiques.  
> **NE JAMAIS déployer en production !**

---

## 📋 Résumé des Sécurités Retirées

Les mesures de sécurité suivantes ont été **intentionnellement retirées** pour démontrer les vulnérabilités :

1. ✅ **HTTPS/SSL** - Remplacé par HTTP
2. ✅ **Audit Logging** (MongoDB) - Supprimé
3. ✅ **Validation de données** (Zod) - Supprimée
4. ✅ **Upload de fichiers sécurisé** - Filtres retirés

---

## 🚨 Vulnérabilités par Catégorie OWASP

### 1️⃣ **A02:2021 - Cryptographic Failures**

#### 📁 Fichier: `server/src/server.js`
**Vulnérabilité**: Utilisation de HTTP au lieu de HTTPS

**Impact**:
- Les données transitent **en clair** sur le réseau
- Les mots de passe, tokens JWT, informations de carte bancaire sont interceptables
- Attaque Man-in-the-Middle (MITM) facilitée
- Aucun chiffrement TLS/SSL

**Démonstration possible**:
```bash
# Intercepter le trafic avec Wireshark ou tcpdump
# Les credentials seront visibles en texte brut
```

**Correctif recommandé**:
- Utiliser HTTPS avec certificats SSL/TLS valides
- Forcer HTTPS avec HSTS headers
- Utiliser Let's Encrypt en production

---

### 2️⃣ **A03:2021 - Injection**

#### 📁 Fichier: `server/src/controllers/authController.js`
**Vulnérabilité**: Aucune validation des entrées utilisateur

**Impact**:
- Possibilité d'injection SQL (bien que Sequelize offre une protection partielle)
- XSS via username/email non sanitisés
- Mots de passe faibles acceptés (ex: "123", "password")
- Username avec caractères dangereux

**Exemples d'exploits**:
```javascript
// Création de compte avec mot de passe faible
POST /api/auth/register
{
  "username": "hack",
  "email": "invalid", 
  "password": "1"
}

// XSS dans le username
{
  "username": "<script>alert('XSS')</script>",
  "email": "test@test.com",
  "password": "weak"
}
```

**Correctif recommandé**:
- Réintégrer Zod validation avec schemas stricts
- Sanitiser toutes les entrées utilisateur
- Politique de mot de passe forte (min 8 chars, majuscule, chiffre, symbole)
- Validation d'email avec regex approprié

---

### 3️⃣ **A03:2021 - Injection (Suite)**

#### 📁 Fichiers: `server/src/controllers/adController.js`
**Vulnérabilité**: Données d'annonces non validées

**Impact**:
- XSS stocké via `title` et `description`
- Prix négatifs ou invalides
- Corruption de base de données

**Exploit XSS**:
```javascript
POST /api/ads
{
  "title": "<img src=x onerror='alert(document.cookie)'>",
  "description": "<iframe src='https://malicious.com'>",
  "price": -1000
}
```

**Correctif recommandé**:
- Validation stricte avec Zod (min/max length, types)
- Sanitization HTML avec bibliothèque comme DOMPurify
- Validation du prix (nombre positif uniquement)

---

### 4️⃣ **A04:2021 - Insecure Design**

#### 📁 Fichier: `server/src/middleware/uploadMiddleware.js`
**Vulnérabilité**: Aucune restriction sur les types de fichiers uploadés

**Impact**:
- Upload de scripts malveillants (.php, .jsp, .exe)
- Upload de webshells
- Upload de fichiers HTML avec XSS
- Attaques via fichiers exécutables
- Déni de service (fichiers trop volumineux - 50MB)

**Exploit possible**:
```bash
# Upload d'un webshell PHP
curl -X POST http://localhost:3000/api/ads \
  -F "file=@shell.php.png" \
  -F "title=Ad" \
  -F "description=Test" \
  -F "price=100"
  
# Le fichier sera accepté et accessible via /uploads/
```

**Correctif recommandé**:
- Whitelist stricte des extensions (png, jpg uniquement)
- Validation des magic bytes (signatures de fichiers)
- Scanner antivirus (ClamAV)
- Stocker hors du webroot
- Limiter taille à 5MB
- Renommer fichiers avec UUID
- Servir avec Content-Disposition: attachment

---

### 5️⃣ **A04:2021 - Insecure Design (Paiement)**

#### 📁 Fichier: `server/src/controllers/transactionController.js`
**Vulnérabilité**: Validation de paiement inexistante

**Impact**:
- Numéros de carte invalides acceptés
- CVV et dates d'expiration non vérifiés
- Fraude facilitée
- Perte de revenus

**Exploit**:
```javascript
POST /api/transactions/purchase
{
  "adId": "valid-uuid",
  "cardNumber": "0000000000000000",
  "expiryDate": "99/99",
  "cvv": "000",
  "cardHolderName": "x"
}
// Sera accepté !
```

**Correctif recommandé**:
- Validation stricte format carte (16 chiffres, Luhn algorithm)
- Validation CVV (3-4 chiffres)
- Validation expiry date (MM/YY format, date future)
- Utiliser vraie gateway de paiement (Stripe, PayPal)

---

### 6️⃣ **A05:2021 - Security Misconfiguration**

#### 📁 Fichier: `server/src/controllers/authController.js`
**Vulnérabilité**: Cookies non sécurisés

**Impact**:
- Cookie transmis en HTTP non chiffré
- Interception facilitée
- Session hijacking possible
- Pas de protection CSRF optimale

**Configuration actuelle**:
```javascript
res.cookie('token', token, {
    httpOnly: true,
    secure: false,      // ⚠️ DANGEREUX
    sameSite: 'lax'     // ⚠️ Pas assez strict
});
```

**Correctif recommandé**:
```javascript
res.cookie('token', token, {
    httpOnly: true,
    secure: true,       // Nécessite HTTPS
    sameSite: 'strict', // Protection CSRF maximale
    maxAge: 3600000
});
```

---

### 7️⃣ **A09:2021 - Security Logging and Monitoring Failures**

#### 📁 Fichier: `server/src/app.js`
**Vulnérabilité**: Audit logging complètement désactivé

**Impact**:
- Aucune traçabilité des actions utilisateurs
- Impossible de détecter une intrusion
- Pas d'alertes en cas d'activité suspecte
- Non-conformité RGPD/réglementations
- Investigation forensique impossible

**Conséquences**:
- Une attaque peut passer inaperçue
- Impossible de savoir qui a fait quoi et quand
- Pas de détection de brute force
- Pas de logs pour analyse sécurité

**Correctif recommandé**:
- Réactiver l'audit logging MongoDB
- Logger toutes les actions sensibles (login, changement mdp, transactions)
- Alertes temps réel sur activités suspectes
- Rotation des logs
- Conformité aux standards (ISO 27001, SOC 2)

---

### 8️⃣ **A05:2021 - Security Misconfiguration (HSTS)**

#### 📁 Fichier: `server/src/middleware/securityMiddleware.js`
**Vulnérabilité**: Pas de HSTS (HTTP Strict Transport Security)

**Impact**:
- Le navigateur n'est pas forcé à utiliser HTTPS
- Attaques de downgrade SSL possible
- Vulnérable aux attaques SSL Strip

**Correctif recommandé**:
```javascript
app.use(helmet.hsts({
    maxAge: 31536000,      // 1 an
    includeSubDomains: true,
    preload: true
}));
```

---

## 🛠️ Tests de Vulnérabilités Recommandés

### Test 1: Interception de credentials (MITM)
```bash
# Utiliser Wireshark/tcpdump pour voir les credentials en clair
tcpdump -i any -A port 3000
```

### Test 2: Upload de fichier malveillant
```bash
# Créer un fichier .php et l'uploader
echo "<?php system(\$_GET['cmd']); ?>" > shell.php
# L'uploader comme image
```

### Test 3: Injection XSS
```javascript
// Créer une annonce avec XSS dans le titre
title: "<img src=x onerror='alert(document.cookie)'>"
```

### Test 4: Mot de passe faible
```bash
# S'enregistrer avec mot de passe "1"
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@t.com","password":"1"}'
```

### Test 5: Carte bancaire invalide
```javascript
// Effectuer un paiement avec carte invalide
cardNumber: "0000000000000000"
cvv: "000"
// Sera accepté !
```

---

## 📊 Tableau Récapitulatif

| Vulnérabilité | OWASP Top 10 | Gravité | Fichier concerné | Impact |
|--------------|-------------|---------|------------------|--------|
| HTTP au lieu HTTPS | A02 - Crypto Failures | 🔴 **CRITIQUE** | server.js | Interception données |
| Pas de validation auth | A03 - Injection | 🔴 **CRITIQUE** | authController.js | XSS, mdp faibles |
| Pas de validation ads | A03 - Injection | 🔴 **CRITIQUE** | adController.js | XSS stocké |
| Upload non filtré | A04 - Insecure Design | 🔴 **CRITIQUE** | uploadMiddleware.js | WebShell, malware |
| Validation paiement | A04 - Insecure Design | 🔴 **CRITIQUE** | transactionController.js | Fraude |
| Cookies non sécurisés | A05 - Misconfig | 🟠 **ÉLEVÉE** | authController.js | Session hijacking |
| Pas d'audit logs | A09 - Logging Failures | 🟠 **ÉLEVÉE** | app.js | Pas de traçabilité |
| Pas de HSTS | A05 - Misconfig | 🟡 **MOYENNE** | securityMiddleware.js | Downgrade SSL |

---

## 🎓 Objectifs Pédagogiques

Ce projet démontre l'importance de :

1. ✅ **Chiffrement** : HTTPS/TLS est indispensable
2. ✅ **Validation** : Toujours valider et sanitiser les entrées
3. ✅ **Upload sécurisé** : Filtrer strictement les fichiers
4. ✅ **Audit** : Logger les actions pour détection d'intrusions
5. ✅ **Configuration** : Headers de sécurité appropriés (HSTS, cookies)

---

## 🔧 Pour rétablir la sécurité

1. Revenir à HTTPS (réactiver `generateCertificates`)
2. Réactiver toutes les validations Zod
3. Réactiver les filtres d'upload
4. Réactiver l'audit logging MongoDB
5. Configurer cookies avec `secure: true` et `sameSite: 'strict'`
6. Réactiver HSTS

---

**Date de modification**: 2025-12-18  
**Objectif**: Démonstration pédagogique de vulnérabilités web  
**Statut**: ⚠️ PROJET VULNÉRABLE - NE PAS UTILISER EN PRODUCTION
