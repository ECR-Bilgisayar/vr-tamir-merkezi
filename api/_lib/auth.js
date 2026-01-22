import jwt from 'jsonwebtoken';

export const verifyToken = (authHeader) => {
    if (!authHeader) return null;

    const token = authHeader.replace('Bearer ', '');

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
};

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};
