import { db } from '../config/db.js';
const bcrypt = require('bcrypt');
import { generateToken } from '../utils/jwtUtils.js';

export const newUser = (req, res) => {
    const { email, password } = req.body;
    const saltRounds = 10;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe sont requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email invalide' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Le mot de passe doit faire au moins 8 caractères' });
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors du hachage du mot de passe' });
        }
        db.query('INSERT INTO user (email, password) VALUES (?,?)', [email, hash], (err, result) => {

            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Cet email est déjà utilisé' });
                }
                console.error(err);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            res.status(201).json({ email, message: 'Utilisateur créé avec succès' });
        })
    })

}

export const signIn = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe sont requis' });
    }
    db.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (result.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        const user = result[0];
        bcrypt.compare(password, user.password, (err, isPasswordValid) => {
            if (err) {
                console.error('Erreur lors de la comparaison des mots de passe :', err);
                return res.status(500).json({ error: 'Erreur serveur' });
            }

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            const token = generateToken(user)
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 3600000
            });
            res.status(200).json({
                message: 'Connexion réussie',
                user: { id: user.id, email: user.email }
            });
        });
    });
}
