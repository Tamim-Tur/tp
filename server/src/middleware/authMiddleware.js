const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    return next();
};

// RENFORCEMENT (exemple commenté): n'accepter que le schéma "Bearer <token>" côté header
// const verifyTokenStrict = (req, res, next) => {
//   const cookieToken = req.cookies.token;
//   const auth = req.headers['authorization'];
//   let token = null;
//   if (cookieToken) token = cookieToken; // privilégier le cookie httpOnly
//   else if (auth && auth.startsWith('Bearer ')) token = auth.substring(7);
//   if (!token) return res.status(401).json({ message: 'Missing or invalid Authorization header' });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
//     req.user = decoded;
//     return next();
//   } catch {
//     return res.status(401).json({ message: 'Invalid Token' });
//   }
// };

module.exports = verifyToken;
