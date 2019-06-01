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
    const testBlog = {
        title: "Add likes"
    }
})

afterAll(() => {
    mongoose.connection.close()
})