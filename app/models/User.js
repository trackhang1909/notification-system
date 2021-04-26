const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const User = new Schema({
    fullname: { type: String, required: true },
    avatar: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
    role: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
    }
}, {
    timestamps: true,
});

User.statics.addTokenToCookie = async (user, rememberPassword, res) => {
    const token = jwt.sign({
        id: user._id,
        fullname: user.fullname,
        avatar: user.avatar,
        role: user.role
    },
    JWT_SECRET);
    rememberPassword === 'on' 
        ? res.cookie('tokenAuth', token, { expires: new Date(Date.now() + 48 * 3600000), httpOnly: true }) 
        : res.cookie('tokenAuth', token);
    return res.redirect('/');
}

module.exports = mongoose.model('users', User);