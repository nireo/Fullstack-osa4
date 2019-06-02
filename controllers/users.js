const usersRouter = require("express").Router()
const bcrypt = require('bcrypt')
const User = require("../models/user")

usersRouter.post("/", async (request, response, next) => {
    try {
        const body = request.body
        
        if (body.password.length <= 3) {
            response.status(400).end()
        } else {
            const salt = 10
            const passwordHash = await bcrypt.hash(body.password, salt)
    
            const user = new User({
                username: body.username,
                name: body.name,
                passwordHash
            })
    
            const savedUser = await user.save()
            response.json(savedUser)
        }
    } catch (exception) {
        next(exception)
    }
})

usersRouter.get("/", async (request, response, next) => {
    const users = await User
    .find({}).populate('blogs')

  response.json(users.map(u => u.toJSON()))
})


module.exports = usersRouter