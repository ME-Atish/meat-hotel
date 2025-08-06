import express from "express";

import * as authController from "../../controllers/v1/auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/me").get(authMiddleware, authController.me);

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Register user
 *     tags:
 *      - auth
 *     description: Register (sign up) user into website (after user register should direct to login page)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                  type: string
 *               lastName:
 *                  type: string
 *               username:
 *                 type: string
 *               phone:
 *                   type: string
 *               email:
 *                  type: string
 *               password:
 *                  type: string
 *               repeatPassword:
 *                  type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       422:
 *         description: Validation error
 *       409:
 *         description: Phone number is ban
 *       403:
 *         description: username or email already exist
 */
router.route("/register").post(authController.register);

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: login user
 *     tags:
 *      - auth
 *     description: Login user in website
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string (email or username)
 *               password:
 *                 type: string
 *               rememberMe:
 *                  type: boolean
 *     responses:
 *       200:
 *         description: User log in successfully
 *       422:
 *         description: Validation error
 *       403:
 *          description: Username or email not found
 *       401:
 *          description: Password is not correct
 */
router.route("/login").post(authController.login);

/**
 * @swagger
 * /v1/auth/login-with-email:
 *   post:
 *     summary: Send login email
 *     description: Sends a login link or token to the user's email address.
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: The email address to send the login message to
 *     responses:
 *       200:
 *         description: Email successfully sent
 *       422:
 *         description: Email is not valid
 */
router.route("/login-with-email").post(authController.loginWithEmail);

/**
 * @swagger
 * /v1/auth/verify-email-code:
 *   post:
 *     summary: Verify email login code
 *     description: Verifies the code sent to the user's email and completes login. Requires `email` cookie set by the previous login request.
 *     tags:
 *       - auth
 *     parameters:
 *       - in: cookie
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address (automatically set in cookie by login-with-email route)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *                 description: Code sent via email for verification
 *     responses:
 *       200:
 *         description: Login successfully
 *       403:
 *         description: Please try again (user not found) OR code is invalid
 *       422:
 *         description: Email validation error OR email is not valid
 */
router.route("/verify-email-code").post(authController.verifyEmailCode);

/**
 * @swagger
 * /v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token cookie
 *     tags:
 *      - auth
 *     parameters:
 *       - in: cookie
 *         name: refresh_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token stored in HttpOnly cookie (Each 20s should send request to this route)
 *     responses:
 *       204:
 *         description: Set new access token in cookies
 *       401:
 *         description: Refresh token expired or invalid
 *       403:
 *         description: User not found or unauthorized
 */
router.route("/refresh-token").post(authController.refreshToken);

router.route("/logout").post(authController.logOut);

export default router;
