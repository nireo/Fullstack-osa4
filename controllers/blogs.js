const blogsRouter = require('express').Router()
const Blog = require("../models/blog")

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs.map(blog => blog.toJSON()))
        })
})

blogsRouter.post('/', (request, response, next) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(savedBlog => {
            response.json(savedBlog.toJSON())
        })
})

module.exports = blogsRouter