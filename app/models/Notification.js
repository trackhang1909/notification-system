const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NotificationType"
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Notification', Notification);