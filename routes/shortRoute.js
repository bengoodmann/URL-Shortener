const {Router} = require("express")
const {createShort} = require("../controllers/shortController")
const authenticate = require("../middlewares/tokenValidation")
const router = Router()

router.use(authenticate)
router.post("/", createShort)

module.exports = router