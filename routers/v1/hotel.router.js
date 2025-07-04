const express = require("express");

const hotelController = require("../../controllers/v1/hotel.controller");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const isAdminMiddlewares = require("../../middlewares/isAdmin.middlewares.js");

const router = express.Router();

router.route("/").get(hotelController.getAll);

module.exports = router;
