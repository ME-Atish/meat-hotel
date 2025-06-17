const express = require("express");

const isAdminMiddleware = require("../../middlewares/isAdmin.middlewares");
const authMiddleware = require("../../middlewares/auth.middleware");
const userController = require("../../controllers/v1/user.controller");

const router = express.Router();

// Get all user's info (only admins access to this route)
router.route("/").get(authMiddleware, isAdminMiddleware, userController.getAll);

// Ban users by id (only admins access to this route)
router
  .route("/ban/:id")
  .post(authMiddleware, isAdminMiddleware, userController.banUser);

// Update the user's info
router.route("/").put(authMiddleware, userController.updateInfo);

// Change role user to admins or vice versa (only admins access to this route)
router
  .route("/role")
  .put(authMiddleware, isAdminMiddleware, userController.changeRole);

// Remove users from website (only admins access to this route )
router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, userController.remove);

module.exports = router;
