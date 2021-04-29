const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema({
    content: { type: String, required: true },
    image: { type: String },
    video: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Post', Post);