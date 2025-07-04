const express = require("express");
const multer = require("multer");

const hotelController = require("../../controllers/v1/hotel.controller");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const isAdminMiddlewares = require("../../middlewares/isAdmin.middlewares.js");
const multerStorage = require("../../utils/uploader.js");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isAdminMiddlewares, hotelController.getAll);

router
  .route("/")
  .post(
    authMiddleware,
    multer({ storage: multerStorage, limits: { fieldSize: 10000000 } }).fields([
      { name: "image", maxCount: 5 },
    ]),
    hotelController.create
  );
router.route("/reserve/:id").post(authMiddleware, hotelController.reserve);
router
  .route("/reserve/:id/cancel")
  .post(authMiddleware, hotelController.cancelReservation);

router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddlewares, hotelController.delete);

router
  .route("/:id")
  .put(authMiddleware, isAdminMiddlewares, hotelController.update);

module.exports = router;
