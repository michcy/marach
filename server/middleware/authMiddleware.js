const isAuthenticated = (req, res, next) => {
    if (req.path === '/login' || req.path === '/register') {
        return next();
    }
    //if (!req.session.authenticated) return res.status(401).json({error: 'Unauthorized'});
    next();
};

module.exports = isAuthenticated;