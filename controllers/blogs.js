const blogsRouter = require('express').Router()
const Blog = require("../models/blog")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
    if (request.body.likes === undefined) {
        request.body = Object.assign({}, request.body, {likes: 0})
    }

    if (request.body.url === undefined || request.body.title === undefined) {
        return response.status(400).json({error: 'content missing'})
    }
    
    const blog = await new Blog(request.body)
    await blog.save()
    response.json(blog.toJSON())
})

module.exports = blogsRouter