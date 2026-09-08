const jwt = require('jsonwebtoken');
require('dotenv').config();

function cookieJwtAuth(req, res, next) {
    const token = req?.headers?.cookie?.split('=')[1];
    try {
        if (!token) {
            return res.status(401).json({ error: 'Currently not logged in' });
        }
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.clearCookie('token', token);
        res.status(400).json({ error: 'Invalid token.' });
    }
}

module.exports = cookieJwtAuth;