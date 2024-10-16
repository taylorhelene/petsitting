
const mongoose = require('mongoose');
const petsitterSchema = new mongoose.Schema({
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
    }]
});
module.exports = mongoose.model('Petsitter', petsitterSchema);

