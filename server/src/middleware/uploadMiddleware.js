const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// VULNÉRABILITÉ (démo): le filtrage de type se base uniquement sur file.mimetype
// - Le mimetype peut être falsifié côté client (ex: un script rebaptisé .png)
// - Le fichier est servi en statique par Express, ce qui augmente la surface d'attaque
// CORRECTION SÉCURISÉE (exemple commenté):
// - Valider la signature ("magic bytes") avec la librairie file-type
// - Éviter d'utiliser l'extension d'origine; déduire l'extension détectée
// - Optionnel: utiliser memoryStorage, vérifier, puis écrire sur disque; servir via un contrôleur avec Content-Disposition: attachment
//
// const { fileTypeFromBuffer } = require('file-type');
// const safeStorage = multer.memoryStorage();
// const secureUpload = multer({
//   storage: safeStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }
// });
// // Dans le contrôleur: 
// // 1) const type = await fileTypeFromBuffer(req.file.buffer);
// // 2) if (!type || !['image/png','image/jpeg'].includes(type.mime)) return res.status(415).json({message:'Type non autorisé'});
// // 3) const filename = `${Date.now()}-${Math.round(Math.random()*1e9)}.${type.ext}`;
// // 4) fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
// // 5) Enregistrer "/uploads/filename" en base

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only .png and .jpg format allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// NOTE chemin/serving:
// - L'appli sert /uploads en statique dans app.js. Pour plus de sécurité:
//   1) placer /uploads hors de la racine publique
//   2) exposer via une route qui renvoie Content-Disposition: attachment
//   3) filtrer l'accès (auth, autorisation) si nécessaire

module.exports = upload;
