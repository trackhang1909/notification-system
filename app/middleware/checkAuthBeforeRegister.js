const jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
    const token = req.cookies.tokenAuth;
    const user = jwt.verify(token, JWT_SECRET);
    await Role.findById(user.role).lean()
    .then(role => {
        if (role.name === 'admin') {
            return next();
        }
    })
    .catch(() => { return res.redirect('back') });
};