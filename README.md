I) Installation

Pour cloner ce projet, utilisez la commande suivante

```bash
git clone git@github.com:Tamim-Tur/tp.git
```

Ensuite, dans le dossier client,
```bash
cd client
```
et exécutez la commande suivante pour installer les dépendances nécessaires :
```bash
npm install
```

Dans le dossier server,
```bash
cd server
```
Et exécutez la commande suivante pour installer les dépendances nécessaires :
```bash
npm install
```
Il se peut qu'un package supplémentaire soit nécessaire pour le serveur, dans ce cas, exécutez la commande suivante :
```bash
npm install cookie-parser
```

> ⚠️ **Important :** Copiez le fichier `.env.example` et renommez la copie en `.env`. Modifiez les variables d'environnement dans le fichier `.env` selon vos besoins.

II) Démarrage
Pour démarrer le front, exécutez la commande suivante dans le dossier client :
```bash
npm run dev
```
Pour démarrer le back, exécutez la commande suivante dans le dossier server :
```bash
node src/server.js
```