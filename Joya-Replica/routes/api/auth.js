const express = require("express");
const router = express.Router();

//controllers
const authController = require("../../controllers/auth.js");

router.get("/me", authController.getCurrentUser);

router.post("/login", authController.login);

module.exports = router;
