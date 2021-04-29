module.exports = async (req, res, next) => {
    return res.locals.role === 'admin' ?  next() : res.redirect('back');
};