require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const port = process.env.port
const cors = require('cors')
const app = express()
const googletts = require('google-tts-api')


app.use(cors())
app.use(express.json())

const mongourl = process.env.mongoUrl

const userroute = require('./Router/UserRouter')
const listroute = require('./Router/ListRouter')
const taskroute = require('./Router/TaskRouter')

app.use('/user', userroute)
app.use('/list', listroute)
app.use('/task', taskroute)

mongoose.connect(mongourl)
.then(() => console.log("connected"))
.catch(() => console.log("not connected"))

app.listen(port, () => {
    console.log(`${port} is litning`)
})