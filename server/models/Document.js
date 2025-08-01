
const mongoose = require('mongoose');

const VersionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const DocumentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    history: [VersionSchema]
});

module.exports = mongoose.model('Document', DocumentSchema);
