const express = require("express");
const router = express.Router();

//controllers
const authController = require("../../controllers/auth.js");

router.get("/me", authController.getCurrentUser);

module.exports = router;
