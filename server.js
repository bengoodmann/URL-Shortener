const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { default: helmet } = require("helmet")
require("dotenv").config()

const DATABASE = require("./config/db")
const {redirectShort} = require("./controllers/shortController")

const PORT = process.env.PORT

const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.post("/", async(req, res) => {
//     req.protocol
//     req.hostname
//     res.redirect
//     req.params
   
// })

app.use("/api/v1/short", require("./routes/shortRoute"))
app.get("/:short", redirectShort)

DATABASE
.sync()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server has started running at port http://localhost:${PORT}`)
    })
})
