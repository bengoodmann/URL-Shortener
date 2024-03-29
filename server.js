const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { default: helmet } = require("helmet")
require("dotenv").config()

const DATABASE = require("./config/db")

const PORT = process.env.PORT || 5000

const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

DATABASE
.sync()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server has started running at port http://localhost:${PORT}`)
    })
})
