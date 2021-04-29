const User = require('../../models/User');
const bcrypt = require('bcrypt');

class LoginController {
    // [GET] /login
    index(req, res) {
        let message = (!!req.query.google && req.query.google === 'fail') ? 'Đăng nhập bằng Google thất bại' : '';
        res.render('auth/login', { username: '', message });
    }
    // [POST] /login
    async store(req, res) {
        try {
            //Google login
            if (req.user) {
                const { googleId } = req.user;
                if (!googleId) {
                    req.logout();
                    return res.redirect('/login?google=fail');
                } 
                return User.addTokenToCookie(req.user, 'on', res);
            }
            //Username login
            const { username, password, rememberPassword } = req.body;
            await User.findOne({ username }).lean()
            .then((user) => {
                if (bcrypt.compareSync(password, user.password)) {
                    return User.addTokenToCookie(user, rememberPassword, res);
                }
                return res.render('auth/login', { username, message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ' });
            })
            .catch((error) => {
                return res.render('auth/login', { username, message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ' });
            });
        }
        catch (error) {
            return res.render('auth/login', { username: '', message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ' });
        }
    }
    // [GET] /login/logout
    logout(req, res) {
        res.clearCookie("tokenAuth");
        req.logout();
        return res.redirect('/login');
    }
}

module.exports = new LoginController();
