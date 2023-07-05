const express = require("express");
const router = express.Router();
const certificateController = require("../controller/certificate.controller");
const UsercertificateController = require("../controller/usercertificate.controller");

router.post("/tasks", certificateController.postTask);
router.get("/tasks", certificateController.getTasks);
router.get("/tasks/:id", certificateController.getTaskBYID);
router.patch("/task/:id", certificateController.patchTask);
router.delete("/task/:id", certificateController.deleteTask);
router.post("/users", UsercertificateController.postUser);
router.get("/users", UsercertificateController.getUsers);
router.get("/users/:id", UsercertificateController.getUserBYID);
router.patch("/users/:id", UsercertificateController.patchUser);
router.delete("/users/:id", UsercertificateController.deleteUser);

router.post("/users", UsercertificateController.login);
router.post("/users", UsercertificateController.token);
router.get("/profile", UsercertificateController.profile);
router.delete("/logout", UsercertificateController.logout);
router.delete("/logoutAll", UsercertificateController.logoutall);

module.exports = router;