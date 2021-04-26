module.exports = (req, res, next) => {
    const token = req.cookies.tokenAuth;
    return token ? res.redirect('/') : next();
};