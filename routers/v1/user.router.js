const express = require("express");

const isAdminMiddleware = require("../../middlewares/isAdmin.middlewares");
const authMiddleware = require("../../middlewares/auth.middleware");
const userController = require("../../controllers/v1/user.controller");

const router = express.Router();

router.route("/").get(authMiddleware, isAdminMiddleware, userController.getAll);

router
  .route("/ban/:id")
  .post(authMiddleware, isAdminMiddleware, userController.banUser);

  
router
  .route("/")
  .put(authMiddleware, userController.updateInfo);

router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, userController.remove);

module.exports = router;
