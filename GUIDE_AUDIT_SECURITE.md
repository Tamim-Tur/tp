# 🔍 Guide d'Audit de Sécurité - Détection des Vulnérabilités

Ce guide explique **comment détecter les vulnérabilités** introduites dans ce projet en utilisant des outils d'audit de sécurité professionnels.

---

## 📋 Table des Matières

1. [Outils d'Audit Recommandés](#outils-daudit-recommandés)
2. [Audit Automatisé](#audit-automatisé)
3. [Audit Manuel](#audit-manuel)
4. [Tests de Pénétration](#tests-de-pénétration)
5. [Analyse du Code Source](#analyse-du-code-source)
6. [Résultats Attendus](#résultats-attendus)

---

## 🛠️ Outils d'Audit Recommandés

### 1. **OWASP ZAP** (Zed Attack Proxy)
- ✅ **Gratuit et Open Source**
- ✅ Détecte : XSS, Injection SQL, Headers manquants, HTTP au lieu HTTPS
- ✅ Scanner automatique + tests manuels
- 📥 [Télécharger](https://www.zaproxy.org/download/)

### 2. **Burp Suite Community**
- ✅ **Gratuit** (version Community)
- ✅ Proxy d'interception HTTP/HTTPS
- ✅ Scanner de vulnérabilités
- 📥 [Télécharger](https://portswigger.net/burp/communitydownload)

### 3. **npm audit**
- ✅ **Intégré à npm**
- ✅ Détecte les vulnérabilités dans les dépendances
- 🚀 Commande : `npm audit`

### 4. **SonarQube / SonarCloud**
- ✅ Analyse statique du code
- ✅ Détecte : Code smell, bugs, vulnérabilités
- ✅ Supporte JavaScript/Node.js
- 📥 [SonarQube](https://www.sonarqube.org/) ou [SonarCloud](https://sonarcloud.io/)

### 5. **Wireshark**
- ✅ **Gratuit**
- ✅ Capture et analyse le trafic réseau
- ✅ Détecte : HTTP non chiffré, cookies non sécurisés
- 📥 [Télécharger](https://www.wireshark.org/download.html)

### 6. **ESLint Security Plugin**
- ✅ Analyse statique JavaScript
- ✅ Détecte : eval(), RegEx dangereux, etc.
- 🚀 `npm install --save-dev eslint-plugin-security`

---

## 🤖 Audit Automatisé

### A. npm audit (Dépendances)

```bash
cd server
npm audit

# Pour voir le détail
npm audit --json

# Pour réparer automatiquement (si possible)
npm audit fix
```

**Ce qui sera détecté** :
- ❌ Vulnérabilités connues dans les packages npm
- ⚠️ Versions obsolètes de dépendances
- ✅ Recommandations de mise à jour

**Pour ce projet** :
- Probablement quelques vulnérabilités mineures dans les dépendances
- Mais **pas les vulnérabilités que nous avons introduites** (logique métier)

---

### B. OWASP ZAP - Scan Automatique

#### Installation et Configuration

1. **Installer OWASP ZAP**
2. **Lancer l'application**
3. **Démarrer votre serveur** : `node src/server.js`

#### Étapes du Scan

```bash
# 1. Dans ZAP, configurer l'URL cible
URL: http://localhost:3000

# 2. Quick Start > Automated Scan
# 3. Entrer l'URL et lancer le scan

# Ou via CLI (Docker)
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 \
  -r zap_report.html
```

**Vulnérabilités qui seront détectées par ZAP** :

| Vulnérabilité | Détection ZAP | Gravité |
|--------------|---------------|---------|
| ✅ Absence HTTPS | ✅ **OUI** - "Site served over HTTP" | 🔴 HIGH |
| ✅ Cookies non sécurisés | ✅ **OUI** - "Cookie without Secure flag" | 🟠 MEDIUM |
| ✅ Headers manquants (HSTS) | ✅ **OUI** - "Missing Anti-clickjacking Header" | 🟠 MEDIUM |
| ✅ XSS (stocké) | ✅ **OUI** - "Cross Site Scripting" | 🔴 HIGH |
| ✅ Absence CSP | ✅ **OUI** - "Content Security Policy missing" | 🟡 LOW |
| ⚠️ Validation absente | ⚠️ **PARTIEL** - Peut détecter via fuzzing | 🟡 MEDIUM |
| ❌ Upload non filtré | ❌ **NON** - Nécessite test manuel | 🔴 CRITICAL |

---

### C. Burp Suite - Scan Passif

```bash
# 1. Lancer Burp Suite
# 2. Configurer le proxy (127.0.0.1:8080)
# 3. Configurer votre navigateur pour utiliser le proxy
# 4. Naviguer sur http://localhost:3000
# 5. Observer les alertes dans l'onglet "Issues"
```

**Alertes Burp attendues** :
- 🔴 "Unencrypted communications" (HTTP)
- 🔴 "Cookie without Secure flag set"
- 🟠 "Cross-origin resource sharing"
- 🟠 "Password field with autocomplete enabled"

---

### D. SonarQube - Analyse Statique

#### Installation (Docker)

```bash
# Lancer SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Accéder à http://localhost:9000 (admin/admin)

# Installer SonarScanner
npm install -g sonarqube-scanner
```

#### Configuration

Créer un fichier `sonar-project.properties` :

```properties
sonar.projectKey=tp-final
sonar.projectName=TP Final - Audit Sécurité
sonar.sources=server/src
sonar.language=js
sonar.sourceEncoding=UTF-8
```

#### Lancer le Scan

```bash
cd server
sonar-scanner
```

**Ce qui sera détecté** :
- ⚠️ "Remove this use of unvalidated user input" (injection)
- ⚠️ "Missing input validation"
- ⚠️ "Sensitive data exposure"
- ⚠️ "Use of weak cryptography" (si applicable)
- 🟡 "Code Smells" divers

---

## 🔍 Audit Manuel

### 1. **Inspection du Code Source**

#### Checklist de Sécurité

```bash
# Vérifier l'absence de validation
grep -r "parse(req.body)" server/src/controllers/
# ❌ Ne devrait PAS apparaître si validation retirée

# Vérifier l'utilisation directe de req.body
grep -r "req.body\." server/src/controllers/
# ✅ Devrait apparaître partout (vulnérable!)

# Vérifier le serveur HTTP
grep -r "http.createServer" server/src/
# ✅ Devrait exister (vulnérable!)

# Vérifier l'absence de filtres upload
grep -r "fileFilter" server/src/middleware/
# ❌ Ne devrait PAS exister ou être commenté

# Vérifier l'absence d'audit logs
grep -r "AuditLog.create" server/src/
# ❌ Ne devrait PAS exister ou être commenté
```

---

### 2. **Test d'Injection XSS Manuel**

#### Test dans le navigateur

```javascript
// 1. S'inscrire avec un username contenant du XSS
username: <img src=x onerror="alert('XSS')">

// 2. Créer une annonce avec XSS
title: <script>alert(document.cookie)</script>

// 3. Vérifier si le code s'exécute lors de l'affichage
```

**Résultat attendu** :
- ✅ Le code JavaScript s'exécute → **Vulnérabilité confirmée**
- ❌ Le code est échappé → Sécurisé

---

### 3. **Test Upload de Fichier Malveillant**

```bash
# 1. Créer un fichier PHP
echo '<?php phpinfo(); ?>' > test.php

# 2. Le renommer en .jpg (mais garder le contenu PHP)
mv test.php test.php.jpg

# 3. L'uploader via l'interface

# 4. Accéder au fichier
curl http://localhost:3000/uploads/[filename]
```

**Si le fichier .php est accepté → Vulnérabilité critique !**

---

## 🎯 Tests de Pénétration

### 1. **Interception HTTP avec Wireshark**

```bash
# 1. Lancer Wireshark
sudo wireshark

# 2. Capturer sur l'interface loopback (lo ou Loopback)
# 3. Filtre : tcp.port == 3000
# 4. Se connecter sur l'application
# 5. Observer le trafic HTTP en clair
```

**Ce que vous verrez** :
```http
POST /api/auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"email":"user@example.com","password":"MonMotDePasse123"}
```

**→ Mot de passe visible en CLAIR ! Vulnérabilité confirmée.**

---

### 2. **Test de Force Brute (Manuel)**

```python
import requests

url = "http://localhost:3000/api/auth/login"
passwords = ["123", "password", "admin", "1234", "12345"]

for pwd in passwords:
    data = {"email": "test@test.com", "password": pwd}
    r = requests.post(url, json=data)
    print(f"Password: {pwd} - Status: {r.status_code}")
```

**Sans rate limiting strict** :
- ✅ Toutes les tentatives passent
- ✅ Force brute possible

---

### 3. **Test SQL Injection (Sequelize protège partiellement)**

```bash
# Tenter une injection dans l'email
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com OR 1=1--","password":"x"}'
```

**Note** : Sequelize utilise des requêtes paramétrées donc l'injection SQL classique ne fonctionnera probablement pas. Mais l'absence de validation reste une faille.

---

## 📊 Résultats Attendus par Outil

### Tableau Récapitulatif

| Vulnérabilité | npm audit | ZAP | Burp | SonarQube | Test Manuel |
|--------------|-----------|-----|------|-----------|-------------|
| **HTTP au lieu HTTPS** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Validation absente** | ❌ | ⚠️ | ⚠️ | ✅ | ✅ |
| **XSS (stocké)** | ❌ | ✅ | ✅ | ⚠️ | ✅ |
| **Upload non filtré** | ❌ | ❌ | ❌ | ⚠️ | ✅ |
| **Cookies non sécurisés** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Pas d'audit logs** | ❌ | ❌ | ❌ | ⚠️ | ✅ |
| **Headers manquants (HSTS)** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Mots de passe faibles** | ❌ | ❌ | ❌ | ⚠️ | ✅ |

**Légende** :
- ✅ = Détection automatique fiable
- ⚠️ = Détection partielle ou indirecte
- ❌ = Non détecté par cet outil

---

## 🎓 Recommandations pour l'Audit

### Approche Complète

1. **Commencer par npm audit** (rapide, gratuit)
2. **Utiliser OWASP ZAP** pour scan automatique
3. **Compléter avec SonarQube** pour analyse statique
4. **Tests manuels** pour upload et validation
5. **Wireshark** pour confirmer HTTP non chiffré
6. **Review de code** manuel approfondi

### Pour Votre Présentation

**Démonstration d'Audit en Live** :

1. 🎬 **Lancer OWASP ZAP** → Montrer les alertes rouges
2. 🎬 **Wireshark** → Capturer un mot de passe en clair
3. 🎬 **Test XSS** → Démontrer l'exécution du script
4. 🎬 **Upload PHP** → Montrer qu'il est accepté
5. 🎬 **SonarQube** → Afficher le rapport avec les vulnérabilités

---

## 📝 Exemple de Rapport d'Audit

### Format Recommandé

```markdown
# Rapport d'Audit de Sécurité - TP Final

**Date** : 18/12/2025
**Auditeur** : [Votre Nom]
**Projet** : Application de Marketplace

## Résumé Exécutif
- 🔴 **8 vulnérabilités critiques** identifiées
- 🟠 **3 vulnérabilités élevées**
- 🟡 **5 vulnérabilités moyennes**

## Méthodologie
- Scan automatisé : OWASP ZAP, SonarQube
- Tests manuels : XSS, Upload, Interception HTTP
- Outils : Wireshark, Burp Suite, npm audit

## Vulnérabilités Critiques

### 1. Transmission HTTP Non Chiffrée
- **Risque** : 🔴 CRITIQUE
- **OWASP** : A02:2021 - Cryptographic Failures
- **Détection** : OWASP ZAP, Wireshark
- **Preuve** : Screenshot Wireshark montrant mot de passe en clair
- **Recommandation** : Implémenter HTTPS avec certificats valides

### 2. Validation des Entrées Absente
- **Risque** : 🔴 CRITIQUE
- **OWASP** : A03:2021 - Injection
- **Détection** : SonarQube, Revue de code
- **Preuve** : Code source montrant `req.body` non validé
- **Recommandation** : Implémenter Zod validation

[...] (continuer pour chaque vulnérabilité)

## Conclusion
L'application présente de **graves failles de sécurité** qui la rendent 
totalement inadaptée à un environnement de production. Des corrections
immédiates sont nécessaires avant tout déploiement.
```

---

## 🚀 Commandes Rapides

```bash
# Audit complet en une seule session

# 1. Audit npm
cd server && npm audit

# 2. Lancer le serveur
node src/server.js &

# 3. Scan ZAP (Docker)
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 -r zap_report.html

# 4. Wireshark (capturer pendant qu'on teste)
sudo wireshark -i lo -f "tcp port 3000" -w capture.pcap

# 5. Test manuel XSS
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"<script>alert(1)</script>","email":"test@test.com","password":"123"}'
```

---

## ✅ Checklist d'Audit Complète

### Avant l'Audit
- [ ] Serveur démarré (HTTP port 3000)
- [ ] OWASP ZAP installé et configuré
- [ ] Wireshark installé
- [ ] Burp Suite installé (optionnel)
- [ ] SonarQube configuré (optionnel)

### Pendant l'Audit
- [ ] Scan OWASP ZAP lancé
- [ ] Capture Wireshark active
- [ ] Tests manuels XSS effectués
- [ ] Tests upload malveillant effectués
- [ ] Tests mot de passe faible effectués
- [ ] Revue du code source complétée

### Après l'Audit
- [ ] Rapport généré
- [ ] Screenshots capturés
- [ ] Preuves de concept documentées
- [ ] Recommandations listées
- [ ] Présentation préparée

---

## 🎯 Conclusion

**OUI, les outils d'audit PEUVENT détecter la majorité de ces vulnérabilités !**

- **Automatiquement** : OWASP ZAP, Burp Suite, SonarQube détectent 60-70% des failles
- **Semi-automatiquement** : Avec configuration et fuzzing, on monte à 80%
- **Manuellement** : Avec expertise et tests ciblés, on atteint 95%+

**Pour votre audit pédagogique** :
1. Utilisez **OWASP ZAP** (gratuit, facile, efficace)
2. Complétez avec **Wireshark** pour HTTP
3. Faites des **tests manuels** pour upload et XSS
4. Documentez tout avec **screenshots et preuves**

Bon audit ! 🔍🛡️
