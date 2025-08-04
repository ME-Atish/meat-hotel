import express from "express";

import * as userController from "../../controllers/v1/user.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import isAdminMiddleware from "../../middlewares/isAdmin.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /v1/user/:
 *   get:
 *     summary: Get all users' information
 *     description: Retrieves information of all users. Only accessible by admins with valid access and refresh tokens in cookies.
 *     tags:
 *       - user
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token cookie for authentication
 *       - in: cookie
 *         name: refresh_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token cookie for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved users' information
 *       403:
 *         description: You have not access to this route
 */
router.route("/").get(authMiddleware, isAdminMiddleware, userController.getAll);

/**
 * @swagger
 * /v1/user/ban/{id}:
 *   post:
 *     summary: Ban a user by ID
 *     description: Bans a user specified by their ID. Only accessible by admins with valid access and refresh tokens in cookies.
 *     tags:
 *       - user
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token cookie for authentication
 *       - in: cookie
 *         name: refresh_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token cookie for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to ban
 *     responses:
 *       200:
 *         description: User banned successfully
 *       403:
 *         description: You have not access to this route or user not found
 *       422:
 *         description: Validation error
 */
router
  .route("/ban/:id")
  .post(authMiddleware, isAdminMiddleware, userController.banUser);

/**
 * @swagger
 * /v1/user/:
 *   put:
 *     summary: Update user's information
 *     description: Updates the authenticated user's information. Requires access token in cookie for authentication.
 *     tags:
 *       - user
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
 *         description: User's info updated successfully
 *       422:
 *         description: Validation error
 */
router.route("/").put(authMiddleware, userController.updateInfo);

/**
 * @swagger
 * /v1/user/role:
 *   put:
 *     summary: Change user role
 *     description: Change a user's role between admin and user. Only accessible by admins with valid access and refresh tokens in cookies.
 *     tags:
 *       - user
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token cookie for authentication
 *       - in: cookie
 *         name: refresh_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token cookie for authentication
 *     requestBody:
 *       description: User role change details (e.g., userId and new role)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the user whose role is being changed
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: User's role changed successfully
 *       422:
 *         description: Validation error
 *       403:
 *         description: User not found
 */
router
  .route("/role")
  .put(authMiddleware, isAdminMiddleware, userController.changeRole);

/**
 * @swagger
 * /v1/user/{id}:
 *   delete:
 *     summary: Remove a user by ID
 *     description: Deletes a user specified by their ID. Only accessible by admins with valid access and refresh tokens in cookies.
 *     tags:
 *       - user
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token cookie for authentication
 *       - in: cookie
 *         name: refresh_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token cookie for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       422:
 *         description: Validation error
 *       403:
 *         description: User not found
 */
router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, userController.remove);

export default router;
