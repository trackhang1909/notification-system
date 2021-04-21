const homeRouter = require('./home');
const loginRouter = require('./login');
const registerRouter = require('./register');
const verifyToken = require('../app/middleware/verifyToken')
const checkAuth = require('../app/middleware/checkAuth')

function route(app) {
    app.use('/register', checkAuth, registerRouter);
    app.use('/login', checkAuth, loginRouter);
    app.use('/', verifyToken, homeRouter);
    app.use((req, res) => res.render('errors/404'));
}

module.exports = route;
