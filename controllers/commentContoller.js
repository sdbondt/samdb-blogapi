const asyncHandler = require("../middleware/asynchandler");
const Comment = require("../models/Comment")
const Post = require("../models/Post")
const { validationResult } = require('express-validator');
const User = require("../models/User");

// POST /api/v1/posts/:id/comments
exports.createComment = asyncHandler(async (req, res, next) => {
    const { postId } = req.params
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next({
            statusCode: 400,
            message: errors.errors[0].msg
        })
    }
    const post = await Post.findById(postId)

    if (!post) {
        return next({
            statusCode: 404,
            message: "Can't create comment, post not found"
        })
    }

    req.body.author = req.user._id
    req.body.post = post._id
    const comment = new Comment(req.body)
    await comment.save()

    res.status(201).json({
        success: true,
        data: comment
    })
})

// GET /api/v1/posts/:postId/comments or GET api/v1/users/:userId/comments
exports.getComments = asyncHandler(async (req, res, next) => {
    const { postId, userId } = req.params
    let query

    if (postId) {
        const post = await Post.findById(postId)
        if (!post) {
            return next({
                statusCode: 400,
                message: 'Post does not exist'
            })
        }
        query = Comment.find({ post: postId })
    } else if (userId) {
        const user = await User.findById(userId)

        if (!user) {
            next({
                statusCode: 400,
                message: 'User does not exist'
            })
        }
        query = Comment.find({ author: userId })
    } else {
        return next({
            statusCode: 400,
            message: 'Bad request'
        })
    }

    const comments = await query

    if (comments.length < 1) {
        return next({
            statusCode: 404,
            message: 'No comments found'
        })
    }

    res.status(201).json({
        success: true,
        data: comments,
    })
})

// GET /api/v1/comments/:id
exports.getComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const comment = await Comment.findById(id)

    if (!comment) {
        return next({
            statusCode: 404,
            message: 'No such comment found'
        })
    }

    res.status(200).json({
        success: true,
        data: comment,
    })

})

// DELETE /api/v1/comments/:id
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const comment = await Comment.findById(id)

    if (!comment) {
        return next({
            statusCode: 404,
            message: 'No such comment found'
        })
    }
    if (comment.author.toString() != req.user._id.toString()) {
        return next({
            statusCode: 401,
            message: 'Not authorized, you must be the author of the comment to delete it'
        })
    }
    await comment.remove()

    res.status(200).json({
        success: true,
        data: {},
    })

})