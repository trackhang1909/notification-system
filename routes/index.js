const homeRouter = require('./home');
const loginRouter = require('./login');
const registerRouter = require('./register');
const verifyToken = require('../app/middleware/verifyToken')
const checkAuthBeforeLogin = require('../app/middleware/checkAuthBeforeLogin')
const checkAuthBeforeRegister = require('../app/middleware/checkAuthBeforeRegister')

function route(app) {
    app.use('/login', checkAuthBeforeLogin, loginRouter);
    app.use(verifyToken);
    app.use('/register', checkAuthBeforeRegister, registerRouter);
    app.use('/', homeRouter);
    app.use((req, res) => res.render('errors/404'));
}

module.exports = route;
