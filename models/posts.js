let mongoose = require('mongoose');

// Articles Schema
let postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    popular: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    }
})

let Post = module.exports = mongoose.model('Post', postSchema);