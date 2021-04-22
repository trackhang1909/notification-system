const User = require('../../models/User');
const bcrypt = require('bcrypt');
const Role = require('../../models/Role');

class RegisterController {
    // [GET] /register
    async index(req, res) {
        const roles = await Role.find({}).lean();
        res.render('auth/register', { roles });
    }
    // [POST] /register
    async store(req, res) {
        try {
            const { username, email, password: plainTextPassword, role } = req.body;
            const password = bcrypt.hashSync(plainTextPassword, 10);
            await User.create({
                username,
                email,
                password,
                role
            });
            return res.status(201).json({error: 'false', message: 'Tạo tài khoản thành công'});
        }
        catch(error) {
            if (error.code === 11000 && error.keyValue.email === undefined) {
                return res.status(400).json({error: 'true', message: 'Tên đăng nhập đã tồn tại'});
            }
            else if (error.code === 11000 && error.keyValue.username === undefined) {
                return res.status(400).json({error: 'true', message: 'Email đã tồn tại'});
            }
            return res.status(400).json({error: 'true', message: 'Yêu cầu không hợp lệ'});
        }
    }
}

module.exports = new RegisterController();