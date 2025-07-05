const express = require("express");

const ownerController = require("../../controllers/v1/owner.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const isAdminMiddlewares = require("../../middlewares/isAdmin.middlewares.js");

const router = express.Router();

/**
 * @swagger
 * /v1/owner/:
 *   get:
 *     summary: Get all hotels list
 *     description: Retrieves the list of all hotels. Requires admin access with valid access and refresh tokens in cookies.
 *     tags:
 *       - Owner
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
 *         description: Successfully retrieved all hotels
 *       403:
 *         description: You have not access to this route
 */
router
  .route("/")
  .get(authMiddleware, isAdminMiddlewares, ownerController.getAll);

/**
 * @swagger
 * /v1/owner/:
 *   post:
 *     summary: Register an owner
 *     description: Registers a new owner. Requires access token in cookie for authentication.
 *     tags:
 *       - Owner
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token cookie for authentication
 *     responses:
 *       201:
 *         description: Successfully registered
 */
router.route("/").post(authMiddleware, ownerController.register);

/**
 * @swagger
 * /v1/owner/{id}:
 *   delete:
 *     summary: Delete an owner by ID
 *     description: Deletes an owner specified by their ID. Requires admin access with valid access and refresh tokens in cookies.
 *     tags:
 *       - Owner
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
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID to delete
 *     responses:
 *       200:
 *         description: Successfully deleted owner
 *       403:
 *         description: You have not access to this route or owner not found
 *       422:
 *         description: Validation error
 */

router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddlewares, ownerController.remove);

/**
 * @swagger
 * /v1/owner/{id}:
 *   put:
 *     summary: Update owner's information
 *     description: Updates the information of an owner specified by their ID. Requires admin access with valid access and refresh tokens in cookies.
 *     tags:
 *       - Owner
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
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID to update
 *     responses:
 *       200:
 *         description: Successfully updated the owner's information
 *       403:
 *         description: You have not access to this route or owner not found
 *       422:
 *         description: Validation error
 */
router
  .route("/:id")
  .put(authMiddleware, isAdminMiddlewares, ownerController.update);

module.exports = router;
