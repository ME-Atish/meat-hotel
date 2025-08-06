import express from "express";

import * as ownerController from "../../controllers/v1/owner.controller.js";
import isAdminMiddleware from "../../middlewares/isAdmin.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isAdminMiddleware, ownerController.getAll)
  .post(authMiddleware, ownerController.create);

router
  .route("/get-one/:id")
  .get(authMiddleware, isAdminMiddleware, ownerController.getOne);

router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, ownerController.remove);

export default router;
