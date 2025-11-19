import { verifyToken } from '../utils/jwtUtils.js';

export const authToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Toekn manquant' });
        }
        const user = await verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        console.log('Erreur de vérification du token', err);
        return res.status(403).json({ error: 'Token invalide ou expiré' })
    }
}