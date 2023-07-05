const userCtrl = require("../controller/user.controller")
const auth = require("../services/auth.service")
const photoUpload = require("../services/uploadImage.service")
const validateObjectId = require("../services/validateObjectId.service")
const router = require("express").Router()
// verify-email
router.post("/:token/verify-email", userCtrl.verifyEmail)
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