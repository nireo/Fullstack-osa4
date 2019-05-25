const config = require("./utils/config")
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const blogsRouter = require("./controllers/blogs")
const middleware = require("./utils/middleware")
const mongoose = require("mongoose")
const cors = require("cors")

console.log("connecting to", config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true})
    .then(() =>{
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("error connecting to MongoDB:", error.message)
    })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use("/api/blogs", blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app