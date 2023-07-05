const router = require("express").Router()

router.use("/auth", require('./auth.route'))
router.use("/user", require('./user.route'))
router.use("/password", require('./password.route'))
module.exports = router