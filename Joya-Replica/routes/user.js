const express = require("express");
const router = express.Router();

// middlewares
const { isLoggedIn } = require("../middleware.js");

// controllers
const userController = require("../controllers/user.js");

// utils Section
const wrapAsync = require("../utils/wrapAsync.js");

// User Dashboard route
router.get("/dashboard", isLoggedIn, wrapAsync(userController.renderDashboard));

module.exports = router;
