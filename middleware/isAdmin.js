const asyncHandler = require("./asynchandler");

const isAdmin = asyncHandler((req, res, next) => {
    const user = req.user
    
    if (user.role !== 'admin') {
        next({
            statusCode: 401,
            message: 'Not authorized, not allowed to post'
      })
    } else {
        next()
    }
})

module.exports = isAdmin