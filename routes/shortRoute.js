const { Router } = require("express")
const { createShort, allUserCreatedShort, getShort, updateShort, deleteShort, searchByName } = require("../controllers/shortController")
const authenticate = require("../middlewares/tokenValidation")
const router = Router()

router.use(authenticate)

router.get("/search", searchByName)

router.route("/").get(allUserCreatedShort).post(createShort)
router.route("/:id").get(getShort).put(updateShort).patch(updateShort).delete(deleteShort)



module.exports = router