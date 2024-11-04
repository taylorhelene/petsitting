const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    preference: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    // Field to store an array of file URLs
    files: [{
        type: String  // Each entry in the array will be a URL (string)
    }],

    similarityAnalysis: [
        {
            image1: String,
            image2: String,
            similarity: String,
            result: String // Store analysis result, e.g., "Similar Person" or "Different Person"
        }
    ],

    // New messages array
    messages: [messageSchema]
});
module.exports = mongoose.model('Owner', ownerSchema);

