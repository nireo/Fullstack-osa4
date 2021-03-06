const blogsRouter = require('express').Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', {username: 1, name: 1})

    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
          return response.status(401).json({ error: 'token missing or invalid' })
        }

        const user = await User.findById(decodedToken.id)

        if (body.likes === undefined) {
            body = Object.assign({}, body, {likes: 0})
        }
    
        if (body.url === undefined || body.title === undefined) {
            return response.status(400).json({error: 'content missing'})
        }

        const toUpload = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })

        const savedBlog = await toUpload.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    const token = getTokenFrom(request)
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const blog = await Blog.findById(request.params.id)
        console.log("blog", blog)
        console.log("decodedToken", decodedToken)

        if (blog.user.toString() === decodedToken.id) {
            await Blog.findByIdAndRemove(blog.id)
            response.status(204).end()
        } else {
            return response.status(401).json({ 
                error: 'token missing or invalid'
             })
        }

    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = await request.body
    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const finished = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true})
    response.json(finished.toJSON())
})

module.exports = blogsRouter