const express = require("express");

const authController = require("../../controllers/v1/auth.controller");

const router = express.Router();

router.route("/register").post(authController.register);
router.route("/login" ).post(authController.login);
router.route("/refresh-token").post(authController.refreshToken);

module.exports = router;
