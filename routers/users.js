const express = require('express')
const router = express.Router()
const { check, body } = require('express-validator')
const { signUp, login, getMe, getUsers } = require('../controllers/userController')
const auth = require('../middleware/auth')
const commentRouter = require('../routers/comments')

router.use('/:userId/comments', auth, commentRouter)

router.post('/register', [
    check('password', 'The password must be at least 6 characters long and contain a number')
        .isLength({ min: 6 })
        .matches(/\d/),
    check('email', 'Must enter a valid email address')
        .isEmail(),
    body('confirmpassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        
          return true;
    })
], signUp)

router.post('/login', [
    check('email', 'Must enter a valid email address').isEmail(),
    check('password', 'You must enter a password').exists()],
    login)

router.get('/', auth, getUsers)

router.get('/me', auth, getMe)

router.post('/logout', auth)



module.exports = router