
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
    content: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    history: [VersionSchema]
});

module.exports = mongoose.model('Document', DocumentSchema);
