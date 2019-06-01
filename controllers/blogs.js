const blogsRouter = require('express').Router()
const Blog = require("../models/blog")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
    const defaultLikes = {likes: 0}

    if (request.body.likes === undefined) {
        request.body = Object.assign({}, request.body, defaultLikes)
    }
    
    const blog = await new Blog(request.body)
    await blog.save()
    response.json(blog.toJSON())
})

module.exports = blogsRouter