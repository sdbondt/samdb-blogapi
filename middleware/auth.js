require('dotenv').config()
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asynchandler');

const auth = asyncHandler(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookie && req.cookies.token) {
      token = req.cookies.token;
    }
  
  if (!token) {
      console.log('No token!');
        return next({
            statusCode: 401,
            message: 'Not authorized'
      });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findOne({email: decoded.id });
  
      next();
    } catch (err) {
      console.log(err);
        return next({
            statusCode: 401,
            message: 'Not authorized'
      });
    }
})
  
module.exports = auth