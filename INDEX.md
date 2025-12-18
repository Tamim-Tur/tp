# 📚 Index de la Documentation

Bienvenue ! Ce fichier répertorie toute la documentation disponible pour ce projet pédagogique.

---

## 🚦 Démarrage Rapide

**Vous êtes pressé ?** Suivez ces étapes :

1. ✅ Lire **README.md** (5 min)
2. ✅ Exécuter **verifier.bat** (2 min)
3. ✅ Lire **VULNERABILITES.md** (10 min)
4. ✅ Consulter **TESTS_VULNERABILITES.md** pour les tests (15 min)

---

## 📄 Liste des Documents

### 1️⃣ **README.md** 📖
**Objectif** : Introduction générale au projet

**Contenu** :
- Instructions d'installation
- Commandes de démarrage
- Avertissement de sécurité
- Liste sommaire des vulnérabilités
- Objectifs pédagogiques

**À lire en premier !**

---

### 2️⃣ **VULNERABILITES.md** 🔓
**Objectif** : Liste exhaustive des failles de sécurité

**Contenu** :
- 8 vulnérabilités détaillées
- Classification OWASP Top 10 2021
- Impact de chaque vulnérabilité
- Exemples d'exploits
- Correctifs recommandés
- Tableau récapitulatif

**Essentiel pour comprendre les failles !**

---

### 3️⃣ **GUIDE_AUDIT_SECURITE.md** 🔍
**Objectif** : Comment détecter les vulnérabilités

**Contenu** :
- Outils d'audit recommandés
  - OWASP ZAP
  - Burp Suite
  - SonarQube
  - Wireshark
  - npm audit
- Instructions d'installation
- Commandes pour lancer les scans
- Résultats attendus
- Tableau de détection par outil
- Checklist d'audit complète

**Parfait pour faire un audit complet !**

---

### 4️⃣ **TESTS_VULNERABILITES.md** 🧪
**Objectif** : Tests pratiques des vulnérabilités

**Contenu** :
- 10 tests concrets avec commandes curl
- Scripts d'exploitation
- Tests XSS, upload malveillant, mots de passe faibles
- Interception HTTP avec Wireshark
- Tests de paiement invalide

**Pour démontrer les failles en pratique !**

---

### 5️⃣ **RESUME_MODIFICATIONS.md** 📝
**Objectif** : Récapitulatif de tout ce qui a été changé

**Contenu** :
- Avant/Après pour chaque modification
- Fichiers modifiés
- Impact de chaque changement
- Guide de présentation (10-15 min)
- Ressources pour approfondir

**Utile pour savoir exactement ce qui a été fait !**

---

### 6️⃣ **verifier.bat** 🔧
**Objectif** : Script de vérification automatique

**Contenu** :
- Vérification Node.js/npm
- Installation automatique des dépendances
- Création du .env si absent
- Résumé des vulnérabilités
- Instructions de démarrage

**Lancez ce script en premier pour tout vérifier !**

---

## 🎯 Par Objectif

### Vous voulez **comprendre les vulnérabilités** ?
1. 📖 README.md
2. 🔓 VULNERABILITES.md
3. 📝 RESUME_MODIFICATIONS.md

### Vous voulez **faire un audit** ?
1. 🔍 GUIDE_AUDIT_SECURITE.md
2. 🧪 TESTS_VULNERABILITES.md

### Vous voulez **démarrer rapidement** ?
1. 🔧 verifier.bat
2. 📖 README.md

### Vous voulez **présenter le projet** ?
1. 📝 RESUME_MODIFICATIONS.md (section "Pour Votre Présentation")
2. 🔓 VULNERABILITES.md (tableau récapitulatif)
3. 🧪 TESTS_VULNERABILITES.md (démonstrations)

---

## 📂 Structure des Fichiers

```
TP FINAL/
│
├── README.md                      ← Commencer ici
├── INDEX.md                       ← Vous êtes ici
├── VULNERABILITES.md              ← Liste des failles
├── GUIDE_AUDIT_SECURITE.md        ← Comment auditer
├── TESTS_VULNERABILITES.md        ← Tests pratiques
├── RESUME_MODIFICATIONS.md        ← Résumé changements
├── verifier.bat                   ← Script de vérification
│
├── server/                        ← Backend (Node.js/Express)
│   ├── src/
│   │   ├── server.js             ← HTTP au lieu HTTPS
│   │   ├── app.js                ← Audit logging retiré
│   │   ├── controllers/
│   │   │   ├── authController.js ← Validation retirée
│   │   │   ├── adController.js   ← Validation retirée
│   │   │   └── transactionController.js ← Validation retirée
│   │   └── middleware/
│   │       ├── uploadMiddleware.js ← Upload non filtré
│   │       └── securityMiddleware.js ← HSTS retiré
│   ├── .env.example              ← Configuration HTTP
│   └── package.json
│
└── client/                        ← Frontend (React/Vite)
    ├── src/
    └── package.json
```

---

## 🎓 Parcours Pédagogique Recommandé

### Jour 1 : Compréhension (2h)
1. Lire **README.md** (15 min)
2. Lire **VULNERABILITES.md** (30 min)
3. Lire **RESUME_MODIFICATIONS.md** (20 min)
4. Explorer le code source (55 min)

### Jour 2 : Installation & Tests (3h)
1. Exécuter **verifier.bat** (10 min)
2. Démarrer le projet (20 min)
3. Suivre **TESTS_VULNERABILITES.md** (150 min)

### Jour 3 : Audit (4h)
1. Installer OWASP ZAP (30 min)
2. Suivre **GUIDE_AUDIT_SECURITE.md** (210 min)

### Jour 4 : Présentation (2h)
1. Préparer slides (60 min)
2. Répéter démonstration (60 min)

**Total : ~11h pour maîtriser complètement le projet**

---

## 🔗 Liens Rapides

| Document | Temps de lecture | Priorité |
|----------|------------------|----------|
| README.md | 5 min | ⭐⭐⭐⭐⭐ |
| VULNERABILITES.md | 15 min | ⭐⭐⭐⭐⭐ |
| GUIDE_AUDIT_SECURITE.md | 25 min | ⭐⭐⭐⭐ |
| TESTS_VULNERABILITES.md | 10 min | ⭐⭐⭐⭐ |
| RESUME_MODIFICATIONS.md | 12 min | ⭐⭐⭐ |

---

## 💡 Conseils

### Pour Réussir Votre Présentation

1. **Maîtrisez 3-4 vulnérabilités en profondeur** plutôt que toutes superficiellement
2. **Préparez des démos visuelles** (Wireshark, OWASP ZAP, XSS)
3. **Ayez des screenshots** de chaque vulnérabilité
4. **Connaissez les numéros OWASP** (A02, A03, A04, etc.)
5. **Proposez toujours un correctif** pour chaque faille

### Pour l'Audit

1. Commencez par **OWASP ZAP** (automatique, rapide)
2. Complétez avec **tests manuels** (upload, XSS)
3. Capturez avec **Wireshark** pour l'impact visuel
4. **Documentez tout** avec screenshots
5. Suivez la checklist dans **GUIDE_AUDIT_SECURITE.md**

---

## ❓ Questions Fréquentes

### Q1 : Par où commencer ?
**R** : Exécutez `verifier.bat`, puis lisez `README.md` et `VULNERABILITES.md`

### Q2 : Je n'ai jamais fait d'audit, comment faire ?
**R** : Suivez pas à pas le `GUIDE_AUDIT_SECURITE.md`, tout est expliqué

### Q3 : Comment démontrer les vulnérabilités ?
**R** : Utilisez les commandes dans `TESTS_VULNERABILITES.md`

### Q4 : OWASP ZAP ne détecte rien, c'est normal ?
**R** : Vérifiez que le serveur tourne bien sur `http://localhost:3000`. ZAP détectera au minimum l'absence de HTTPS et HSTS.

### Q5 : Puis-je déployer ce projet ?
**R** : ⚠️ **NON ! JAMAIS !** Ce projet est EXTRÊMEMENT vulnérable, uniquement pour l'apprentissage.

---

## 🆘 Besoin d'Aide ?

Si vous êtes bloqué :

1. Relisez le document concerné plus attentivement
2. Vérifiez que le serveur fonctionne (`node src/server.js`)
3. Consultez les logs d'erreur
4. Vérifiez votre `.env`
5. Essayez de redémarrer le serveur

---

## ✅ Checklist Finale

Avant votre présentation, vérifiez :

- [ ] Projet installé et fonctionnel
- [ ] 3 documents de base lus (README, VULNERABILITES, TESTS)
- [ ] Au moins 3 vulnérabilités testées en pratique
- [ ] OWASP ZAP installé et testé
- [ ] Screenshots/preuves capturés
- [ ] Slides de présentation préparés
- [ ] Démonstration répétée au moins une fois

---

**Bon courage pour votre présentation ! 🎓🔐**

*N'oubliez pas : la sécurité n'est pas optionnelle !*
