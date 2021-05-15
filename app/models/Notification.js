const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    files: [{ type: String }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Notification', Notification);