const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
    queue: { 
        type: [Map],
        default: []
    },
    queueHistory: {
        type: [Map],
        default: []
    }
});

module.exports = mongoose.model('Queue', queueSchema);