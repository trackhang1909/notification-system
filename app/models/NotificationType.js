const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationType = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('NotificationType', NotificationType);