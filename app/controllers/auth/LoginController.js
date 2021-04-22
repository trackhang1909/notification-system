const User = require('../../models/User');

class LoginController {
    // [GET] /login
    index(req, res) {
        res.render('auth/login', { username: '', message: '' });
    }
    // [POST] /login
    async store(req, res) {
        try {
            const { username, password, rememberPassword } = req.body;
            await User.findOne({ username }).lean()
            .then((user) => {
                User.addTokenToCookie(user, password, rememberPassword, res);
            })
            .catch(() => {
                return res.render('auth/login', { username, message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ' });
            });
        }
        catch (error) {
            return res.render('auth/login', { username, message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ' });
        }
    }
}

module.exports = new LoginController();
