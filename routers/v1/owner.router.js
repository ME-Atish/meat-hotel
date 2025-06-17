const express = require("express");

const ownerController = require("../../controllers/v1/owner.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const isAdminMiddlewares = require("../../middlewares/isAdmin.middlewares.js");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isAdminMiddlewares, ownerController.getAll);

router.route("/").post(authMiddleware, ownerController.register)

module.exports = router;
