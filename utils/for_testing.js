const User = require("../models/user")

// just a to test jest
const dummy = (blogs) => {
    return 1;
}

// count up all the likes
const totalLikes = (blogs) => {
    let total = blogs.reduce((previous, now) => {
        return previous + now.likes
    }, 0)
    return total
}

const favoriteBlog = (blogs) => {
    let indexOfBlog = blogs.reduce((previous, now) => {
        return previous.likes > now.likes ? previous: now
    }, 0)
    return indexOfBlog
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    usersInDb
}