const express = require("express");

const isAdminMiddleware = require("../../middlewares/isAdmin.middlewares");
const authMiddleware = require("../../middlewares/auth.middleware");
const userController = require("../../controllers/v1/user.controller");

const router = express.Router();

router.get("/", authMiddleware, isAdminMiddleware, userController.getAll);


module.exports = router