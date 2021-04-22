const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const User = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
        }
    ]
}, {
    timestamps: true,
});

User.statics.addTokenToCookie = async (user, password, rememberPassword, res) => {
    if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            role: user.role
        },
        JWT_SECRET);
        if (rememberPassword === 'on') {
            res.cookie('tokenAuth', token, { expires: new Date(Date.now() + 48 * 3600000), httpOnly: true });
        }
        else {
            res.cookie('tokenAuth', token);
        }
        return res.redirect('/');
    }
}

module.exports = mongoose.model('users', User);