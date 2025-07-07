import express from "express"

import * as authController from "../../controllers/v1/auth.controller.js"
const router = express.Router()

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Register user
 *     tags: 
 *      - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               firstName:
 *                  type: string
 *               lastName:
 *                  type: string
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
 *     description: Login user in website (For get refreshToken set rememberMe in request body to true)
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

export default router