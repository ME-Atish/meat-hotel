import express from "express";

import * as ownerController from "../../controllers/v1/owner.controller.js";
import isAdminMiddleware from "../../middlewares/isAdmin.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /v1/owner:
 *   get:
 *     summary: Get all owners
 *     description: Returns a list of all users who are owners. Requires admin access with valid access and refresh tokens in cookies.
 *     tags:
 *       - owner
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication
 *       - in: cookie
 *         name: refresh_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token for authentication
 *     responses:
 *       200:
 *         description: List of owners retrieved successfully
 *       403:
 *         description: You do not have access to this route
 */
router
  .route("/")
  .get(authMiddleware, isAdminMiddleware, ownerController.getAll);

/**
 * @swagger
 * /v1/owner:
 *   post:
 *     summary: Make the current user an owner
 *     description: Promotes the currently authenticated user to an owner role. Requires a valid access token in cookies.
 *     tags:
 *       - owner
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication
 *     responses:
 *       201:
 *         description: From now on, the user is an owner.
 *       403:
 *         description: User not found or you are already owner
 */
router.route("/").post(authMiddleware, ownerController.create);

/**
 * @swagger
 * /v1/owner/get-one/{id}:
 *   get:
 *     summary: Get one owner by ID
 *     description: Retrieves the information of a specific owner by ID. Only accessible by admins. Requires valid access and refresh tokens in cookies.
 *     tags:
 *       - owner
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication
 *       - in: cookie
 *         name: refresh_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID to retrieve
 *     responses:
 *       200:
 *         description: List get it successfully
 *       403:
 *         description: You do not have access to this route
 */
router
  .route("/get-one/:id")
  .get(authMiddleware, isAdminMiddleware, ownerController.getOne);

/**
 * @swagger
 * /v1/owner/{id}:
 *   delete:
 *     summary: Remove owner role from a user
 *     description: Converts an owner back to a regular user. Only accessible by admins. Requires valid access and refresh tokens in cookies.
 *     tags:
 *       - owner
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication
 *       - in: cookie
 *         name: refresh_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID to remove
 *     responses:
 *       200:
 *         description: From now on, owner become user
 *       403:
 *         description: You do not have access to this route or owner not found
 */
router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, ownerController.remove);

export default router;
