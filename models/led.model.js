const mongoose = require('mongoose');

const ledSchema = new mongoose.Schema({
    name: { type: String },
    pos: { type: Number },
    color: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('LED', ledSchema);