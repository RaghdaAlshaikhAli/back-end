const { contactUsCtrl } = require("../controller/contact.controller");

const router = require("express").Router();

router.post("/contact", contactUsCtrl);

module.exports = router;
