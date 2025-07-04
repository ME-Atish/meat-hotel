const express = require("express");
const multer = require("multer");

const hotelController = require("../../controllers/v1/hotel.controller");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const isAdminMiddlewares = require("../../middlewares/isAdmin.middlewares.js");
const multerStorage = require("../../utils/uploader.js");

const router = express.Router();

router.route("/").get(hotelController.getAll);

router
  .route("/")
  .post(
    authMiddleware,
    multer({ storage: multerStorage, limits: { fieldSize: 10000000 } }).fields([
      { name: "image", maxCount: 5 },
    ]),
    hotelController.create
  );

module.exports = router;
