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

blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndUpdate(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = blogsRouter