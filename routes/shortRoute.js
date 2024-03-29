const {Router} = require("express")
const {createShort} = require("../controllers/shortController")
const router = Router()

router.post("/", createShort)

module.exports = router