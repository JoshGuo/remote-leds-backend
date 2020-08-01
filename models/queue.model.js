const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
    queue: { 
        type: [Map],
        default: []
    },
    dequeueHistory: {
        type: [Map],
        default: []
    },
    currentMode: {
        type: Map,
        default: {
            mode: -1,
            name: "Default"
        }
    }
});

module.exports = mongoose.model('Queue', queueSchema);