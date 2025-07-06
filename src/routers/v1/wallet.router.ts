import express from "express"

const authMiddleware = require("../../middlewares/auth.middleware");
const walletController = require("../../controllers/v1/wallet.controller");

const router = express.Router();
/**
 * @swagger
 * /v1/increase:
 *   post:
 *     summary: Charge user account
 *     description: Charges the authenticated user's account. Requires access token in cookie for authentication.
 *     tags:
 *       - Wallet
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token cookie for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to charge
 *                 example: 100.00
 *     responses:
 *       200:
 *         description: Account charged successfully
 *       422:
 *         description: Validation error
 */
router.route("/increase").post(authMiddleware, walletController.increase);
/**
 * @swagger
 * /v1/decrease:
 *   post:
 *     summary: Deduct amount from user account
 *     description: Deducts a specified amount from the authenticated user's account. Requires access token in cookie for authentication.
 *     tags:
 *       - Wallet
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token cookie for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to be deducted
 *                 example: 50.00
 *             required:
 *               - amount
 *     responses:
 *       200:
 *         description: The amount was successfully deducted
 *       406:
 *         description: The amount to be deducted is less than the account balance
 *       422:
 *         description: Validation error
 */
router.route("/decrease").post(authMiddleware, walletController.decrease);

export default router