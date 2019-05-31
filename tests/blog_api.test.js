const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

const api = supertest(app)

// check for response type
test("blogs are returned as json", async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect("Content-Type", /application\/json/)
})

test("a valid blog", async () => {
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
        
    const response = await api.get("/api/blogs")

    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
        'async/await test'
    )
})

afterAll(() => {
    mongoose.connection.close()
})