const homeRouter = require('./home');
const loginRouter = require('./login');
const registerRouter = require('./register');
const postRouter = require('./post');
const updateAccountRouter = require('./update_account');
const notificationRouter = require('./notification');
const verifyToken = require('../app/middleware/verifyToken');
const checkAuthBeforeLogin = require('../app/middleware/checkAuthBeforeLogin');
const checkAuthBeforeRegister = require('../app/middleware/checkAuthBeforeRegister');
const LoginController = require('../app/controllers/auth/LoginController');

function route(app) {
    app.use('/login', checkAuthBeforeLogin, loginRouter);
    app.use(verifyToken);
    app.use('/logout', LoginController.logout);
    app.use('/register', checkAuthBeforeRegister, registerRouter);
    app.use('/', homeRouter);
    app.use('/post', postRouter);
    app.use('/update-account', updateAccountRouter);
    app.use('/notification', notificationRouter);
    app.use((req, res) => res.render('errors/404'));
}

module.exports = route;
