const mongoose  = require("mongoose")
const supertest = require("supertest")
const app       = require("../app")
const Blog      = require("../models/blog")
const User      = require("../models/user")
const helper    = require("../utils/for_testing")
const api       = supertest(app)

// check for response type
test("blogs are returned as json", async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect("Content-Type", /application\/json/)
})

test("post a valid blog", async () => {
    const newBlog = {
        title: "async/await test",
        author: "me",
        url: "localhost",
        likes: 2
    }
    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(200)
        .expect("Content-type", /application\/json/)

    // get blogs from /api/blogs
    const response = await api.get("/api/blogs")

    // get blogs from database
    const blogs = await Blog.find({})
    expect(response.body.length).toBe(blogs.length)
})

test("if there are no likes add likes: 0", async () => {
    let testBlog = {
        title: "Add likes test",
        author: "me",
        url: "localhost"
    }
    
    if (testBlog.likes === undefined) {
        testBlog = await Object.assign({}, testBlog, {likes: 0})
    }

    await api
        .post("/api/blogs")
        .send(testBlog)
        .expect(200)
        .expect("Content-type", /application\/json/)

    const response = await api.get("/api/blogs")
    expect(response.body[response.body.length - 1].likes).toBeGreaterThan(-1)
})

test("search that there is no _id just id", async () => {
    const response = await api.get("/api/blogs")
    response.body.map(blog => {
       expect(blog._id).toBeUndefined()
   })

})

test("send status 400 if no title or author", async () => {
    const testBlog = {
        title: "No longer human",
        author: "Osamu Dazai",
        likes: 12
    }

    await api
        .post("/api/blogs")
        .send(testBlog)
        .expect(400)
})

describe("there is one user in db", () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const user = new User({username: "root", password: "salasana"})
        await user.save()
    })
    
    test("user is created", async () => {
        const startingUsers = await helper.usersInDb()

        const newUser = {
            username: "tester",
            name: "Testi Mattinen",
            password: "salasana"
        }
    
        await api
            .post("/api/users")
            .send(newUser)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(startingUsers.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
})


afterAll(() => {
    mongoose.connection.close()
})