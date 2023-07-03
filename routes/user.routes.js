const userCtrl = require("../controller/user.controller")

const auth = require("../service/auth.service")
const photoUpload = require("../service/uploadImage.service")
const validateObjectId = require("../service/validateObjectId.service")

const router = require("express").Router()

// @route user/:id/activate
router.get("/:id/activate", validateObjectId, auth.verifyAdminToken, userCtrl.activateUserAccount)
//@route user/
router.get("/", auth.verifyAdminToken, userCtrl.getAllUsers)
router.post("/new", auth.verifyAdminToken, userCtrl.newUser)
//route user/:id
router.route("/:id")
    .get(validateObjectId, auth.authenticate, userCtrl.getUserProfile)
    .put(validateObjectId, auth.verifyTokenOnlyUser, photoUpload.single("image"), userCtrl.updateUser)
    .delete(validateObjectId, auth.verifyTokenAuthorization, userCtrl.deleteUser)
module.exports = router