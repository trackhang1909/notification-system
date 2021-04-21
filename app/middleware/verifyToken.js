const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const token = req.cookies.token || 'a.b.c';
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) return res.redirect('/login');
        next();
    });
};