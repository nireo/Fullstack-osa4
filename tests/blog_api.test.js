const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")

const api = supertest(app)

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
    for (let i = 0; i < response.body.length; i++) {
        expect(response.body[i]._id).toBeUndefined()
    }
})

test("send status 400 if no title or author", async () => {

})

afterAll(() => {
    mongoose.connection.close()
})