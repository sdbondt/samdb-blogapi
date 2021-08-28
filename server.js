require('dotenv').config()
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3000

// third party security middleware
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const hpp = require('hpp')
const cors = require('cors')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')


// import error handler
const errorHandler = require('./middleware/errorHandler')

// serve static assets
app.use(express.static(path.join(__dirname, 'public')))

// import routers
const userRouter = require('./routers/users')
const commentRouter = require('./routers/comments')
const postRouter = require('./routers/posts')


// body parsing
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// handle cookies
app.use(cookieParser())

// set security headers
app.use(helmet())

//prevent xss attacks
app.use(xss())

//enable cors
app.use(cors())

// sanitize data
app.use(mongoSanitize())

//rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
});
app.use(limiter)

//prevent http param pollution
app.use(hpp())

// implement routes
app.get('/', (req, res) => {
   return res.sendFile('index.html')
})
app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/comments', commentRouter)

// connec to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})