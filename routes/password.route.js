const router = require('express').Router()
const pass = require('../controller/password.controller')
router.post("/forgot-password", pass.forgotPassword)
router.post("/reset-password/:token", pass.resetPassword)
module.exports = router