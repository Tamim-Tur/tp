# Insecure Demo (Training Only)

This app is intentionally vulnerable and must never be used in production. It exists solely to generate audit findings (ZAP/Sonar) for educational comparison with the secured main app.

## Vulnerabilities included
- No HTTPS; plain HTTP server.
- No security headers (`helmet` absent); X-Powered-By visible.
- CORS wildcard with credentials allowed.
- Reflective XSS at `/` via `?name=`.
- Weak auth: unsigned token in cookie without `HttpOnly`/`Secure`.
- Broken access control at `/admin` (query-based grant).
- SQL injection pattern at `/user` (string concatenation).
- Code injection via `eval` at `/exec`.
- CSRFable state change at `/transfer`.

## Run
```powershell
cd "C:\Users\tamim\Desktop\etudes 2025-2026\Efrei\cours\semaine de 15-19 decembre\TP FINAL\training\insecure-demo"
npm install
npm start
```
App: http://localhost:3002

If `npm audit` shows 0 vulnerabilities
- Remove lock and modules, then reinstall to force the vulnerable graph:
```powershell
cd "C:\Users\tamim\Desktop\etudes 2025-2026\Efrei\cours\semaine de 15-19 decembre\TP FINAL\training\insecure-demo"
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm audit --audit-level=low
```

## Quick ZAP scan (GUI)
- Start ZAP.
- Set target: http://localhost:3002
- Spider + Active Scan. Review alerts (XSS, missing headers, insecure cookies, etc.).

## SonarQube (optional)
Create a temporary `sonar-project.properties` in this folder and run `sonar-scanner`. Expect reliability/maintainability/security issues.

## Disclaimer
This code is intentionally insecure for training. Do not copy into the main application nor expose it publicly.
