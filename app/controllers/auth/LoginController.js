const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

class LoginController {
    // [GET] /login
    index(req, res) {
        res.render('auth/login', { username: req.query.username, message: '' });
    }
    // [POST] /login
    async store(req, res) {
        const { username, password, rememberPassword } = req.body;
        const user = await User.findOne({ username }).lean();
        if (!user) {
            return res.render('auth/login', { username, message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ' });
        }
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({
                id: user._id,
                username: user.username,
            },
            JWT_SECRET);
            if (rememberPassword === 'on') {
                res.cookie('token', token, { expires: new Date(Date.now() + 48 * 3600000), httpOnly: true });
            }
            else {
                res.cookie('token', token);
            }
            return res.redirect('/');
        }
        return res.render('auth/login', { username, message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ' });
    }
}

module.exports = new LoginController();
