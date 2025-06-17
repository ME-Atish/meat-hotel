const express = require("express");

const authController = require("../../controllers/v1/auth.controller");

const router = express.Router();

// register route
router.route("/register").post(authController.register);
// login route 
router.route("/login" ).post(authController.login);
// refresh token route for give access token and tokens will expire in 20 sec
router.route("/refresh-token").post(authController.refreshToken);

module.exports = router;
