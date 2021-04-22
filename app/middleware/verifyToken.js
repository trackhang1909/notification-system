const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const token = req.cookies.tokenAuth;
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) {
            res.clearCookie('tokenAuth');
            return res.redirect('/login');
        }
        return next();
    });
};