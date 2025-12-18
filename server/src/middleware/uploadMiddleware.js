const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// VULNÉRABILITÉ CRITIQUE (démo): Aucune validation de type de fichier
// Un attaquant peut uploader:
// - Des scripts malveillants (.php, .jsp, .aspx)
// - Des fichiers exécutables (.exe, .sh, .bat)
// - Des fichiers HTML avec XSS
// - Des archives contenant des malwares
// - N'importe quel type de fichier dangereux
//
// CORRECTION SÉCURISÉE recommandée:
// 1. Valider le mimetype ET la signature du fichier (magic bytes)
// 2. Whitelist stricte des extensions autorisées
// 3. Scanner antivirus
// 4. Stocker hors du webroot
// 5. Renommer les fichiers avec UUID
// 6. Limiter la taille
// 7. Servir avec Content-Disposition: attachment

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // VULNÉRABILITÉ: Garde l'extension d'origine sans vérification
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// VULNÉRABILITÉ: Pas de fileFilter - accepte TOUS les fichiers !
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB - trop permissif
    // PAS DE fileFilter = DANGEREUX !
});

module.exports = upload;
