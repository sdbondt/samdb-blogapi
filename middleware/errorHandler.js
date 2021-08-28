const errorHandler = (err, req, res, next) => {
    console.log(`err message: ${err.message}`)
    console.log(`err stack: ${err.stack}`)
    let error = { ...err }

    if (err.kind === 'ObjectId') {
        error.statusCode = 400
        error.message = "Wrong resource, objectId not correct"
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    })
};

module.exports = errorHandler