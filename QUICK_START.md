# ⚡ Résumé Ultra-Rapide (2 minutes)

## 🎯 Le Projet en 3 Phrases

1. **Application** : Marketplace web (petites annonces) avec backend Node.js et frontend React
2. **Objectif** : Démonstration pédagogique de **8 vulnérabilités intentionnelles**
3. **Usage** : Formation en cybersécurité - **NE JAMAIS déployer en production**

---

## 🔓 Les 8 Vulnérabilités

| # | Quoi | Gravité |
|---|------|---------|
| 1 | HTTP au lieu de HTTPS | 🔴 |
| 2 | Pas de validation (auth) | 🔴 |
| 3 | Pas de validation (annonces) | 🔴 |
| 4 | Upload non filtré | 🔴 |
| 5 | Pas de validation paiement | 🔴 |
| 6 | Cookies non sécurisés | 🟠 |
| 7 | Pas d'audit logs | 🟠 |
| 8 | Pas de HSTS | 🟡 |

---

## 🚀 Démarrage Express

```bash
# Backend
cd server
npm install
cp .env.example .env
node src/server.js

# Frontend (autre terminal)
cd client
npm install
npm run dev
```

**URLs** :
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

---

## 🔍 Comment Tester ?

### Test Rapide #1 : Mot de passe faible
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"1"}'
```
✅ **Si ça marche → Vulnérable !**

### Test Rapide #2 : XSS
Créer une annonce avec titre : `<script>alert('XSS')</script>`
✅ **Si le script s'exécute → Vulnérable !**

### Test Rapide #3 : OWASP ZAP
1. Installer OWASP ZAP
2. Quick Start > Automated Scan
3. URL : `http://localhost:3000`
✅ **Devrait détecter 5-6 vulnérabilités**

---

## ❓ FAQ Ultra-Rapide

**Q: npm audit trouve 0 vulnérabilités, pourquoi ?**
**R:** Normal ! npm audit vérifie les dépendances npm, pas votre code. Nos vulnérabilités sont dans le code applicatif.

**Q: Comment détecter les vulnérabilités ?**
**R:** OWASP ZAP (automatique) + tests manuels + Wireshark

**Q: Puis-je utiliser ce code en production ?**
**R:** ⛔ **NON ! JAMAIS !** Ce projet est VOLONTAIREMENT vulnérable.

---

## 📚 Documentation Complète

| Fichier | Contenu | Temps |
|---------|---------|-------|
| **README.md** | Introduction générale | 5 min |
| **VULNERABILITES.md** | Liste détaillée des failles | 15 min |
| **GUIDE_AUDIT_SECURITE.md** | Comment auditer | 25 min |
| **TESTS_VULNERABILITES.md** | Tests pratiques | 10 min |
| **NPM_AUDIT_EXPLICATION.md** | Pourquoi npm audit = 0 | 5 min |

---

## ✅ Pour Votre Présentation

**Démonstration en 10 minutes** :

1. **Wireshark** : Capturer un mot de passe en clair (2 min)
2. **XSS** : Injecter du code malveillant (2 min)
3. **Upload** : Uploader un fichier .php (2 min)
4. **OWASP ZAP** : Montrer le rapport d'audit (4 min)

**Message clé** :
> "La sécurité n'est pas optionnelle. Ces 8 vulnérabilités simples 
> rendent l'application totalement inutilisable en production."

---

**C'est tout ! Pour plus de détails, consultez les autres fichiers .md 📖**
