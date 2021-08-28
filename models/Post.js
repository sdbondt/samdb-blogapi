const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: {
        type: String,
        required: [true, 'You must supply a title']
    },
    content: {
        type: String,
        required: [true, 'You supply some content']
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    published: {
        type: Boolean,
        default: false
    }
}, { timestamps: true})

const Post = model('Post', PostSchema)

module.exports = Post