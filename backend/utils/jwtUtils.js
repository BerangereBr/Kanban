const jwt = require('jsonwebtoken');

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.SecretKey,
        { expiresIn: '1h' }
    );
};

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SecretKey, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};