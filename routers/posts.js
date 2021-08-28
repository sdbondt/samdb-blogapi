const express = require('express')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')
const { check } = require('express-validator')
const { getPosts, getPost, deletePost, createPost, publish } = require('../controllers/postController')
const commentRouter = require('./comments')
const router = express.Router()

router.use('/:postId/comments', auth, commentRouter)

router.post('/', [
    check('title', 'You must supply a title').exists(),
    check('content', 'You must supply some content').exists(),
],
    auth,
    isAdmin,
    createPost)

router.get('/', getPosts)

router.get('/:id', auth, getPost)

router.delete('/:id', auth, isAdmin, deletePost)

router.put('/:id/publish', isAdmin, publish)

module.exports = router