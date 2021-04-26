const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../models/User');

module.exports = (req, res, next) => {
    const token = req.cookies.tokenAuth;
    jwt.verify(token, JWT_SECRET, async function (err, decoded) {
        let user;
        if (decoded) {
            user = await User.findById(decoded.id).lean();
            res.locals.userId = decoded.id;
            res.locals.role = decoded.role;
            res.locals.fullname = decoded.fullname;
            res.locals.avatar = decoded.avatar;
        }
        if (err || !user) {
            res.clearCookie('tokenAuth');
            return res.redirect('/login');
        }
        return next();
    });
};