const asyncHandler = require("../middleware/asynchandler");
const User = require("../models/User");
const { validationResult } = require('express-validator')

// cookie options
const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  }

// POST /api/v1/users/signup
exports.signUp = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next({
            statusCode: 400,
            message: errors.errors[0].msg
        })
    }
    
    const user = new User(req.body)
    await user.save()
    const token = user.getSignedJwtToken()
    res.status(201).cookie('token', token, options).json({
        success: true,
        data: user,
        token
    })
})

// POST /api/v1/users/login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next({
            statusCode: 400,
            message: errors.errors[0].msg
        })
    }

    const user = await User.findOne({ email })

    if (!user) {
        return next({
            statusCode: 401,
            message: 'Invalid credentials'
        })
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next({
            statusCode: 401,
            message: 'Invalid credentials'
        });
    }

    const token = user.getSignedJwtToken()
    console.log(token)
    res.status(201).cookie('token', token, options).json({
        success: true,
        data: user,
        token
    })
})

// GET api/v1/users
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        data: users,
    })

})
// GET api/v1/users/me
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = req.user
    res.status(200).json({
        success: true,
        data: user,
    })
})

// POST /api/v1/users/logout
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    })
    
    res.status(200).json({
        success: true,
        data: {},
    })
    
})