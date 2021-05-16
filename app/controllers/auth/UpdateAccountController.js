const User = require("../../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

class UpdateAccountController {
    // [POST] /update-account/upload-avatar
    uploadAvatar(req, res) {
        let sampleFile = req.files.upload;
        let uploadPath = global.rootName + '/public/uploads/images/' + sampleFile.name;

        sampleFile.mv(uploadPath, function(err) {
            if (err) return res.status(500).json({ uploaded: false });

            res.status(200).json({
                uploaded: true,
                url: '/uploads/images/' + sampleFile.name,
            });
        });
    }
    // [GET] /update-account
    async updateAccountView(req, res) {
        const user = await User.findById(res.locals.userId).lean();
        res.render('auth/update', { user });
    }
    // [POST] /update-account/student
    updateAccountStudent(req, res) {
        const { fullname, class: classValue, faculty, avatar } = req.body;
        let options = { fullname, class: classValue, faculty, avatar };
        if (!avatar) {
            options = { fullname, class: classValue, faculty };
        }
        User.updateOne({ _id: res.locals.userId }, options).then(() => {
            const token = jwt.sign({
                id: res.locals.userId,
                fullname: fullname,
                avatar: avatar ? avatar : res.locals.avatar,
                role: res.locals.role
            },
            JWT_SECRET);
            res.cookie('tokenAuth', token, { expires: new Date(Date.now() + 48 * 3600000), httpOnly: true, overwrite: true });
            return res.status(201).json({error: 'false', message: 'Cập nhật tài khoản thành công'});
        }).catch(error => {
            return res.status(400).json({error: 'true', message: 'Yêu cầu không hợp lệ'});
        });        
    }
    // [POST] /update-account/faculty
    updateAccountFaculty(req, res) {
        const { fullname, password: plainTextPassword, avatar } = req.body;
        const password = bcrypt.hashSync(plainTextPassword, 10);
        let options = { fullname, password, avatar };
        if (!avatar) {
            options = { fullname, password };
        }
        User.updateOne({ _id: res.locals.userId }, options).then(() => {
            const token = jwt.sign({
                id: res.locals.userId,
                fullname: fullname,
                avatar: avatar ? avatar : res.locals.avatar,
                role: res.locals.role
            },
            JWT_SECRET);
            res.cookie('tokenAuth', token, { expires: new Date(Date.now() + 48 * 3600000), httpOnly: true, overwrite: true });
            return res.status(201).json({error: 'false', message: 'Cập nhật tài khoản thành công'});
        }).catch(error => {
            return res.status(400).json({error: 'true', message: 'Yêu cầu không hợp lệ'});
        });        
    }
}

module.exports = new UpdateAccountController();
