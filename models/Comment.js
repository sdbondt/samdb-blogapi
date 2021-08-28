const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'You must supply some content']
    }
}, {
    timestamps: true
})

const Comment = model('Comment', CommentSchema)

module.exports = Comment