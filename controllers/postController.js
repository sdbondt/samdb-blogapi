const asyncHandler = require("../middleware/asynchandler")
const Post = require("../models/Post")
const { validationResult } = require('express-validator')

// POST api/v1/posts
exports.createPost = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next({
            statusCode: 400,
            message: errors.errors[0].msg
        })
    }

    req.body.author = req.user._id
    const post = new Post(req.body)
    await post.save()
    res.status(201).json({
        success: true,
        data: post,
    })
})

// PUT /api/v1/posts/:id/publish
exports.publish = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const post = await Post.findById(id)

  if (!post) {
    return next({
      statusCode: 404,
      message: 'Post not found'
    })
  } else {
    post.published = !post.published
    await post.save()
    res.status(201).json({
      success: true,
      data: post
    })
  }

})

// GET api/v1/posts(?published=true/false&limit=10&sortBy=asc)
exports.getPosts = asyncHandler(async (req, res, next) => {
  let { published, sortBy, limit, page } = req.query
  published = published === 'false' ? false : true
  sortBy = sortBy === 'asc' ? 'asc' : 'desc'
  limit = parseInt(limit) || 5
  page = parseInt(page) || 1
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Post.countDocuments({ published })

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  const posts = await Post.find({ published }).skip(startIndex).limit(limit).sort({ createdAt: sortBy })
  res.status(200).json({
    succes: true,
    data: posts,
    count: posts.length,
    pagination,
  }) 
})

// GET /api/v1/posts/:id
exports.getPost = asyncHandler(async (req, res, next) => {  
  const { id } = req.params

  const post = await Post.findById(id)

  if (!post) {
    return next({
      statusCode: 404,
      message: 'Post not found'
    })
  }

  res.status(200).json({
    success: true,
    data: post,
  })
})

// DELETE /api/v1/posts/:id
exports.deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const post = await Post.findById(id)

  if (!post) {
    return next({
      statusCode: 404,
      message: 'Could not delete, post not found'
    })
  }

  await post.remove()

  res.status(204).json({
    success: true,
    data: {},
  })
})