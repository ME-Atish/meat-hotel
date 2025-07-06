const express = require("express");

const isAdminMiddleware = require("../../middlewares/isAdmin.middlewares");
const authMiddleware = require("../../middlewares/auth.middleware");
const walletController = require("../../controllers/v1/wallet.controller");

const router = express.Router();

router.route("/increase").post(authMiddleware, walletController.increase);
router.route("/decrease").post(authMiddleware, walletController.decrease)

module.exports = router;
