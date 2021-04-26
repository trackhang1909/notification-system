const Role = require('../models/Role');

module.exports = async (req, res, next) => {
    const role = await Role.findById(res.locals.role).lean();
    return !!role && role.name === 'admin' ?  next() : res.redirect('back');
};