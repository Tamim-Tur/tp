# Rapport de Sécurisation — Application Annonces

Date: 17/12/2025  
Équipe: Groupe de 4 étudiants

## 1. Présentation du projet
Application web de petites annonces avec messagerie et achat simulé. Architecture 3-tiers: client React (Vite), API Node/Express, base PostgreSQL via Sequelize (+ MongoDB optionnel pour audit).

## 2. Architecture technique
- **Front-end:** React + Vite, axios, contexte d’auth (`AuthContext`).
- **Back-end:** Express, Sequelize (PostgreSQL), JWT, bcrypt, Zod, Helmet, CORS, express-rate-limit, Multer.
- **Base de données:** PostgreSQL (modèles `User`, `Ad`, `Transaction`, `Message`). MongoDB optionnel pour `AuditLog`.
- **HTTPS:** serveur `https.createServer` avec certificats auto-signés.

## 3. Conception fonctionnelle
- Annonces: création, modification, suppression, marquage vendu.
- Auth: inscription/connexion JWT + cookie sécurisé, profil.
- Messagerie: conversations par annonce, non-lus.
- Paiement: simulation sécurisée, transactions enregistrées, carte non stockée.

## 4. Développement de l’application
- Lien front/back sécurisé par CORS + cookies (`withCredentials`).
- Validation entrée avec Zod côté API; validations ORM côté DB.
- Upload images avec contrôle type/poids.

## 5. Sécurisation de l’API
Chaque exigence inclut le script et la fonction correspondants.

### 5.1 Sécurité des communications
- **HTTPS (TLS):** serveur en HTTPS via [server/src/server.js](server/src/server.js), fonction `startServer()` utilisant `https.createServer()` et certificats générés par [server/src/utils/certGenerator.js](server/src/utils/certGenerator.js) (`generateCertificates()`).
- **HSTS:** activé dans [server/src/middleware/securityMiddleware.js](server/src/middleware/securityMiddleware.js) via `helmet.hsts()` dans `setupSecurity(app)`.
- **Headers HTTP de sécurité:** [server/src/middleware/securityMiddleware.js](server/src/middleware/securityMiddleware.js), `setupSecurity(app)` applique `helmet()` (CSP/NoSniff/Frameguard, etc. par défaut du package).
- **Configuration CORS:** [server/src/middleware/securityMiddleware.js](server/src/middleware/securityMiddleware.js), `setupSecurity(app)` configure `cors()` avec `origin`, `credentials`, `methods`, `allowedHeaders`.

### 5.2 Authentification & sessions
- **Hashage sécurisé des mots de passe (bcrypt):** [server/src/controllers/authController.js](server/src/controllers/authController.js), fonctions `register()` et `seedData()` dans [server/src/seed.js](server/src/seed.js) utilisent `bcrypt.hash()` et `bcrypt.compare()`.
- **JWT (sessions côté client via cookie):** [server/src/controllers/authController.js](server/src/controllers/authController.js), `login()` génère le JWT (`jsonwebtoken.sign`) et pose un cookie `token` sécurisé (`httpOnly`, `secure`, `sameSite`). Vérification via [server/src/middleware/authMiddleware.js](server/src/middleware/authMiddleware.js) (`verifyToken`).
- **Expiration:** `login()` signe le JWT avec `expiresIn: '1h'`. Cookie `maxAge: 3600000`.
- **Cookies sécurisés:** `login()` et `logout()` posent/retirent le cookie `token` avec `httpOnly`, `secure`, `sameSite`.
- **Protection brute force:** [server/src/middleware/securityMiddleware.js](server/src/middleware/securityMiddleware.js), `setupSecurity(app)` applique `express-rate-limit` global (15 min, max 100).
- **Session fixation:** jeton JWT régénéré à chaque `login()` et stocké en cookie HttpOnly; pas d’ID de session persistant côté serveur.

### 5.3 Protection OWASP (principales)
- **Injection (SQL/NoSQL):**
  - SQL: utilisation d’ORM Sequelize dans les contrôleurs ([server/src/controllers/*.js](server/src/controllers)) utilisant `findByPk`, `findAll`, `create`, évite la concaténation SQL.
  - Validation d’entrée par schémas Zod: [server/src/utils/validation.js](server/src/utils/validation.js) (`registerSchema`, `loginSchema`, `adSchema`, `paymentSchema`).
  - NoSQL: Mongo utilisé uniquement pour `AuditLog`; pas d’input utilisateur dans requêtes Mongo sans validation.
- **XSS:**
  - Côté client: React échappe le HTML par défaut; aucune utilisation de `dangerouslySetInnerHTML` dans [client/src/pages/*.jsx](client/src/pages) et [client/src/components/*.jsx](client/src/components).
  - Côté serveur: `helmet()` ajoute en-têtes XSS et `nosniff`; les champs texte sont rendus dans React, donc échappés.
- **Broken Access Control:**
  - Middleware d’auth: [server/src/middleware/authMiddleware.js](server/src/middleware/authMiddleware.js) (`verifyToken`).
  - Vérifications d’autorisation métier dans [server/src/controllers/adController.js](server/src/controllers/adController.js) (`updateAd()`, `deleteAd()`, `markAsSold()`) assurent que seul le propriétaire agit.
  - Routes protégées: [server/src/routes/*](server/src/routes) appliquent `verifyToken` pour actions sensibles (ads, messages, transactions, user).
- **Security Misconfiguration:**
  - Headers standard via `helmet()`; HSTS explicite.
  - HTTPS obligatoire (serveur démarre en TLS uniquement).
  - CORS strict (origine, méthodes, en-têtes).
  - Logs d’audit (optionnels) via Mongo dans [server/src/app.js](server/src/app.js).
- **Cryptographic Failures:**
  - Mots de passe jamais en clair; stockage hashé bcrypt 10 rounds ([authController.register](server/src/controllers/authController.js), [seed](server/src/seed.js)).
  - JWT signé avec `JWT_SECRET` (variable d’environnement), expirations gérées.
  - Paiement: aucune donnée sensible persistée; stockage token de paiement + 4 derniers chiffres ([server/src/controllers/transactionController.js](server/src/controllers/transactionController.js)).
- **Vulnerable & Outdated Components:**
  - Dépendances listées dans [server/package.json](server/package.json) et [client/package.json](client/package.json). Audit via `npm audit` (voir section Outils).

### 5.4 Stockage sécurisé des données
- **Séparation données/secrets/config:**
  - Config DB via env dans [server/src/config/database.js](server/src/config/database.js).
  - Connexion Mongo conditionnée par `MONGO_URI` dans [server/src/config/mongo.js](server/src/config/mongo.js).
  - Exemple d’environnement: [server/.env.example](server/.env.example). Aucun secret dans le front.
- **Aucune donnée sensible en clair:**
  - MDP hashés, pas de carte bancaire stockée; seulement `maskedCardNumber` et `paymentToken`.

## 6. Outils de sécurité
- **SonarQube (analyse statique):**
  - Lancer un serveur SonarQube local, scanner Node/React.
  - Commandes indicatives: installer `sonar-scanner`, configurer `sonar-project.properties`, exécuter le scan et analyser dettes/vulnérabilités.
- **OWASP ZAP (analyse dynamique):**
  - Démarrer l’API en local (`https://localhost:3000`), pointer ZAP sur les endpoints `/api/*`. Ajouter cookie `token` pour parcours authentifié.
  - Examiner alertes (XSS, CSRF, headers manquants) et reporter corrections/justifications.
- **npm audit (dépendances):**
  - Côté serveur: `cd server && npm install && npm audit`.
  - Côté client: `cd client && npm install && npm audit`.
  - Corriger via `npm audit fix` quand pertinent; documenter risques résiduels.

## 7. Gestion des secrets & configuration
- Fichier d’exemple: [server/.env.example](server/.env.example). À copier en `.env` et compléter.
- Jamais exposer `JWT_SECRET` ni identifiants DB côté client. `axios` utilise cookies HttpOnly.

## 8. Utilisation de l’IA (transparente)
- **Outils IA utilisés:** GitHub Copilot (GPT-5) pour aide au code, audit, rédaction.
- **Gains:** accélération de revue sécurité, génération de documentation, suggestions ciblées (HSTS, CORS, validations).
- **Pertes/limites:** possible sur/sous-détection sans exécution des scanners; nécessite validation humaine; certains paramètres (CSP) peuvent casser le front si trop strict.
- **Regard critique:** l’IA propose, l’équipe dispose; chaque décision est argumentée et vérifiée.

## 9. Limites, difficultés, axes d’amélioration
- Certificat auto-signé: OK pour dev; en prod, utiliser ACME/Let’s Encrypt et activer HSTS en connaissance de cause.
- CSP: à durcir (whitelist précise des sources) après inventaire des assets.
- Rate-limit: ajouter limite spécifique aux endpoints d’auth.
- Journaux d’audit: étendre avec corrélation et alerting.
- Intégrer tests de sécurité automatisés CI (SAST/DAST) et SBOM.

## 10. Conclusion
L’application respecte les exigences clés: communications sécurisées (HTTPS/HSTS), authentification robuste (bcrypt+JWT+cookies sécurisés), contrôles d’accès, validations d’entrée, et stockage sûr. Les outils de sécurité et la documentation permettent une mise en production maîtrisée, avec axes clairs pour durcissement futur.

## Emplacements Précis (fichiers & fonctions)
- **HTTPS (TLS):** [server/src/server.js](server/src/server.js) — `startServer()` utilise `https.createServer({ key, cert }, app)` avec certificats fournis par [server/src/utils/certGenerator.js](server/src/utils/certGenerator.js) — `generateCertificates()`.
- **HSTS:** [server/src/middleware/securityMiddleware.js](server/src/middleware/securityMiddleware.js) — `setupSecurity(app)` appelle `helmet()` et `helmet.hsts()`.
- **Headers de sécurité:** [server/src/middleware/securityMiddleware.js](server/src/middleware/securityMiddleware.js) — `setupSecurity(app)` applique `helmet()` (XSS protection, `x-content-type-options`, `frameguard`, etc.).
- **CORS:** [server/src/middleware/securityMiddleware.js](server/src/middleware/securityMiddleware.js) — `setupSecurity(app)` configure `cors()` avec `origin`, `credentials`, `methods`, `allowedHeaders` via `corsOptions`.
- **Rate limiting (anti brute force):** [server/src/middleware/securityMiddleware.js](server/src/middleware/securityMiddleware.js) — `setupSecurity(app)` utilise `express-rate-limit` (fenêtre 15 min, max 100).
- **Hashage des mots de passe (bcrypt):** [server/src/controllers/authController.js](server/src/controllers/authController.js) — `register()` fait `bcrypt.hash()`; `login()` fait `bcrypt.compare()`; [server/src/seed.js](server/src/seed.js) hash aussi les mots de passe semés.
- **JWT & cookies sécurisés:** [server/src/controllers/authController.js](server/src/controllers/authController.js) — `login()` appelle `jwt.sign()` puis `res.cookie('token', ...)` avec `httpOnly`, `secure`, `sameSite`, `maxAge`; `logout()` nettoie avec mêmes drapeaux.
- **Vérification du JWT:** [server/src/middleware/authMiddleware.js](server/src/middleware/authMiddleware.js) — `verifyToken()` lit le cookie `token` ou l’en-tête `Authorization` et appelle `jwt.verify()`; attache `req.user`.
- **Contrôles d’accès (ownership):** [server/src/controllers/adController.js](server/src/controllers/adController.js) — `updateAd()`, `deleteAd()`, `markAsSold()` comparent `ad.userId` à `req.user.userId` et retournent 403 si non propriétaire.
- **Routes protégées (auth requise):** [server/src/routes/adRoutes.js](server/src/routes/adRoutes.js), [server/src/routes/messageRoutes.js](server/src/routes/messageRoutes.js), [server/src/routes/transactionRoutes.js](server/src/routes/transactionRoutes.js), [server/src/routes/userRoutes.js](server/src/routes/userRoutes.js) — appliquent `verifyToken`.
- **Validation des entrées (Zod):** [server/src/utils/validation.js](server/src/utils/validation.js) — schémas `registerSchema`, `loginSchema`, `adSchema`, `paymentSchema` utilisés dans [server/src/controllers/authController.js](server/src/controllers/authController.js), [server/src/controllers/adController.js](server/src/controllers/adController.js), [server/src/controllers/transactionController.js](server/src/controllers/transactionController.js).
- **ORM sécurisé (prévention injection SQL):** appels ORM dans les contrôleurs: `User.findOne()`, `User.create()` ([server/src/controllers/authController.js](server/src/controllers/authController.js)); `Ad.create()`, `Ad.findAll()`, `Ad.findByPk()` ([server/src/controllers/adController.js](server/src/controllers/adController.js)); `Transaction.create()`, `Transaction.findAll()` ([server/src/controllers/transactionController.js](server/src/controllers/transactionController.js)); `Message.create()`, `Message.findAll()` ([server/src/controllers/messageController.js](server/src/controllers/messageController.js)).
- **Paiement (pas de stockage PAN):** [server/src/controllers/transactionController.js](server/src/controllers/transactionController.js) — `purchaseAd()` envoie les données carte au faux PSP et ne stocke que `paymentToken` et `maskedCardNumber`; modèle [server/src/models/Transaction.js](server/src/models/Transaction.js) définit `maskedCardNumber` et `paymentToken`.
- **Upload sécurisé:** [server/src/middleware/uploadMiddleware.js](server/src/middleware/uploadMiddleware.js) — `fileFilter` limite aux `image/jpeg` et `image/png`, `limits.fileSize` à 5MB, nom de fichier unique; chemin public servi via `app.use('/uploads', express.static('uploads'))` dans [server/src/app.js](server/src/app.js).
- **Logs d’audit (Mongo optionnel):** [server/src/app.js](server/src/app.js) — middleware d’audit écoute `res.on('finish')` et écrit via `AuditLog.create(...)` si Mongo connecté.
- **Gestion config/secret via env:** [server/src/config/database.js](server/src/config/database.js) lit `process.env.DB_*`; [server/src/config/mongo.js](server/src/config/mongo.js) lit `process.env.MONGO_URI`; exemple fourni dans [server/.env.example](server/.env.example).
- **XSS côté client:** React échappe par défaut; affichages de texte (ex. [client/src/pages/Home.jsx](client/src/pages/Home.jsx)) n’utilisent pas `dangerouslySetInnerHTML`. Aucune donnée secrète exposée côté client; cookies HttpOnly gérés via axios (`withCredentials`) dans [client/src/context/AuthContext.jsx](client/src/context/AuthContext.jsx).

## Avant → Après (vulnérabilités corrigées)
Nota: Les extraits « Avant » ci-dessous sont illustratifs et NON commités. Ils servent à montrer ce qui a été évité/corrigé; le dépôt conserve seulement la version sécurisée.

- **Communications (HTTPS/HSTS/CORS/Headers)**
  - Avant (vulnérable, exemple):
    ```js
    // server.js (exemple avant)
    const http = require('http');
    const app = require('./app');
    http.createServer(app).listen(3000);
    // Pas de helmet(), pas d’HSTS, CORS: *
    app.use(require('cors')());
    ```
  - Après (sécurisé): [server/src/server.js](server/src/server.js) `https.createServer(...)`; [server/src/middleware/securityMiddleware.js](server/src/middleware/securityMiddleware.js) `setupSecurity(app)` avec `helmet()`, `helmet.hsts()`, CORS strict (`origin`, `credentials`, `methods`, `allowedHeaders`).

- **Authentification & sessions (hashage, JWT, cookies)**
  - Avant (vulnérable, exemple):
    ```js
    // authController (exemple avant)
    const user = await User.create({ email, password: req.body.password }); // mot de passe en clair
    const token = jwt.sign({ id: user.id }, 'weak', { /* sans expiresIn */ });
    res.cookie('token', token); // sans HttpOnly/Secure/SameSite
    ```
  - Après (sécurisé): [server/src/controllers/authController.js](server/src/controllers/authController.js) `register()` utilise `bcrypt.hash()`, `login()` signe le JWT avec `expiresIn: '1h'` et pose un cookie `httpOnly`, `secure`, `sameSite`, `maxAge`.

- **Contrôle d’accès (Broken Access Control)**
  - Avant (vulnérable, exemple):
    ```js
    // adController (exemple avant)
    // Pas de middleware verifyToken, pas de vérif propriétaire
    await ad.update(req.body); // n'importe qui peut modifier
    ```
  - Après (sécurisé): [server/src/middleware/authMiddleware.js](server/src/middleware/authMiddleware.js) `verifyToken()`; [server/src/controllers/adController.js](server/src/controllers/adController.js) `updateAd()`, `deleteAd()`, `markAsSold()` comparent `ad.userId` à `req.user.userId` et retournent 403 si non propriétaire.

- **Injection (SQL/NoSQL)**
  - Avant (vulnérable, exemple):
    ```js
    // (exemple avant)
    const users = await sequelize.query("SELECT * FROM Users WHERE email='" + email + "'");
    ```
  - Après (sécurisé): utilisation d’ORM (`User.findOne`, `Ad.findByPk`, etc.) et validation Zod dans [server/src/utils/validation.js](server/src/utils/validation.js) appliquée dans les contrôleurs.

- **XSS**
  - Avant (vulnérable, exemple):
    ```jsx
    // Home.jsx (exemple avant)
    <div dangerouslySetInnerHTML={{ __html: ad.description }} />
    ```
  - Après (sécurisé): rendu texte standard dans [client/src/pages/Home.jsx](client/src/pages/Home.jsx); headers de sécurité via `helmet()` côté API.

- **Security Misconfiguration**
  - Avant (vulnérable, exemple): pas de `helmet()`, CORS wildcard, logs verbeux de données sensibles, HTTP simple.
  - Après (sécurisé): `helmet()`, HSTS, CORS restrictif, HTTPS, audit log maîtrisé dans [server/src/app.js](server/src/app.js).

- **Cryptographic Failures (paiement)**
  - Avant (vulnérable, exemple):
    ```js
    // transactionController (exemple avant)
    await Transaction.create({ amount, cardNumber: req.body.cardNumber }); // stockage PAN complet
    ```
  - Après (sécurisé): [server/src/controllers/transactionController.js](server/src/controllers/transactionController.js) `purchaseAd()` ne stocke que `paymentToken` et `maskedCardNumber`; jamais le PAN complet.

- **Rate limiting / Anti brute force**
  - Avant (vulnérable, exemple): aucune limitation des requêtes.
  - Après (sécurisé): [server/src/middleware/securityMiddleware.js](server/src/middleware/securityMiddleware.js) applique `express-rate-limit` global.

- **Upload de fichiers**
  - Avant (vulnérable, exemple): pas de `fileFilter`, types/tailles non contrôlés.
  - Après (sécurisé): [server/src/middleware/uploadMiddleware.js](server/src/middleware/uploadMiddleware.js) limite aux `image/jpeg`/`image/png`, 5MB max, nommage unique.

- **Secrets & Configuration**
  - Avant (vulnérable, exemple):
    ```js
    const JWT_SECRET = 'secret'; // en dur dans le code
    ```
  - Après (sécurisé): variables d’environnement lues dans [server/src/config/database.js](server/src/config/database.js) et [server/src/config/mongo.js](server/src/config/mongo.js); exemple fourni dans [server/.env.example](server/.env.example).

<!-- Section démo vulnérable retirée à la demande -->
