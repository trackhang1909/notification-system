const User = require('../../models/User');
const bcrypt = require('bcrypt');
const Role = require('../../models/Role');
const Category = require('../../models/Category');

class RegisterController {
    // [GET] /register
    async index(req, res) {
        const roles = await Role.find({}).lean();
        const categories = await Category.find({}).lean();
        res.render('auth/register', { roles, categories });
    }
    // [POST] /register
    async store(req, res) {
        try {
            const { fullname, username, email, password: plainTextPassword, role, categories } = req.body;
            const password = bcrypt.hashSync(plainTextPassword, 10);
            await User.create({
                fullname,
                username,
                email,
                password,
                role,
                categories
            });
            return res.status(201).json({error: 'false', message: 'Tạo tài khoản thành công'});
        }
        catch(error) {
            if (error.code === 11000 && error.keyValue.username !== undefined) {
                return res.status(400).json({error: 'true', message: 'Tên đăng nhập đã tồn tại'});
            }
            else if (error.code === 11000 && error.keyValue.email !== undefined) {
                return res.status(400).json({error: 'true', message: 'Email đã tồn tại'});
            }
            return res.status(400).json({error: 'true', message: 'Yêu cầu không hợp lệ'});
        }
    }
    // [GET] /register/update-categories
    async indexUpdateCategories(req, res) {
        const categories = await Category.find({}).lean();
        const users = await User.find({}).lean();
        res.render('auth/update_categories', { users, categories });
    }
    // [POST] /register/get-categories
    getCategories(req, res) {
        const { _id } = req.body;
        User.find({ _id }).lean().then(user => {
            return res.json({ status: 'success', user });
        })
        .catch(() => {
            return res.json({ status: 'fail', user });
        });
    }
    // [POST] /register/update-categories
    async updateCategories(req, res) {
        const { _id, categories } = req.body;
        User.updateOne({ _id }, { categories })
        .then(() => { return res.json({ status: 'success', message: 'Cập nhật thành công' }) })
        .catch(() => { return res.json({ status: 'fail', message: 'Cập nhật thất bại' }) })
    }
}

module.exports = new RegisterController();