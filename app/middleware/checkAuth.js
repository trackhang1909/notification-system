module.exports = (req, res, next) => {
    const token = req.cookies.token;
    token ? res.redirect('/') : next();
};