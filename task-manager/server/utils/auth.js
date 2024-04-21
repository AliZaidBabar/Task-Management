const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token is required' });
    }
    try {
        const decoded = jwt.verify(token, 'fvgbhnjm345678bh');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = verifyToken;
