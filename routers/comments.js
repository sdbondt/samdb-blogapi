const express = require('express')
const { createComment, getComment, deleteComment, getComments } = require('../controllers/commentContoller')
const auth = require('../middleware/auth')
const { check } = require('express-validator')
const router = express.Router({ mergeParams: true })

router.get('/', getComments)

router.post('/', check('content', 'You should provide some content').exists(), createComment)

router.get('/:id', auth, getComment)

router.delete('/:id', auth, deleteComment)

module.exports = router