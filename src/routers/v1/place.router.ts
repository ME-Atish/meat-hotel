import express from "express"
import multer from "multer"

import * as placeController from "../../controllers/v1/place.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import isAdminMiddleware from "../../middlewares/isAdmin.middleware.js";
import multerStorage from "../../utils/uploader.js";

const router = express.Router();

/**
 * @swagger
 * /v1/place:
 *   get:
 *     summary: Get all places
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
 *     tags: [place]
 *     responses:
 *       200:
 *         description: List of places returned successfully
 *       403:
 *          description: User not found or you have not access to this route
 */

router
  .route("/")
  .get(authMiddleware, isAdminMiddleware, placeController.getAll);

/**
 * @swagger
 * /v1/place:
 *   post:
 *     summary: Create a new place
 *     description: Creates a new place with the provided details and images. Requires access token in cookie.
 *     tags:
 *       - place
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the place
 *                 example: place Sunshine
 *               address:
 *                 type: string
 *                 description: Address of the place
 *                 example: 123 Main St
 *               description:
 *                 type: string
 *                 description: Description of the place
 *                 example: A cozy and comfortable place
 *               facilities:
 *                 type: string
 *                 description: facilities of place
 *                 example: "pool, bedroom, kitchen"
 *               price:
 *                 type: number
 *                 description: Price per night
 *                 example: 150000
 *               province:
 *                 type: string
 *                 description: Province where the place is located
 *                 example: Ontario
 *               city:
 *                 type: string
 *                 description: City where the place is located
 *                 example: Toronto
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Up to 5 images of the place
 *     responses:
 *       201:
 *         description: place created successfully
 *
 *       403:
 *         description: User not found or you have not access to this route
 *       422:
 *         description: Validation error
 */
router
  .route("/")
  .post(
    authMiddleware,
    multer({ storage: multerStorage, limits: { fieldSize: 10000000 } }).fields([
      { name: "image", maxCount: 5 },
    ]),
    placeController.create
  );

/**
 * @swagger
 * /v1/reserve/{id}:
 *   post:
 *     summary: Reserve a place
 *     description: Reserve a place by its ID. Requires access token in cookie for authentication.
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token cookie for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: place ID to reserve
 *     responses:
 *       200:
 *         description: place reserved successfully
 *       422:
 *         description: Validation error
 *       409:
 *         description: place already reserved or user already has a reservation for this place
 */
router.route("/reserve/:id").post(authMiddleware, placeController.reserve);

/**
 * @swagger
 * /v1/reserve/{id}/cancel:
 *   post:
 *     summary: Cancel a place reservation
 *     description: Cancels an existing place reservation by place ID. Requires access token in cookie for authentication.
 *     tags:
 *       - Reservation
 *     parameters:
 *       - in: cookie
 *         name: access_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token cookie for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: place ID to cancel
 *     responses:
 *       200:
 *         description: The reservation operation was successfully canceled
 *       422:
 *         description: Validation error
 *       403:
 *         description: You have not access to this route
 */

router
  .route("/reserve/:id/cancel")
  .post(authMiddleware, placeController.cancelReservation);

/**
 * @swagger
 * /v1/place/{id}:
 *   delete:
 *     summary: Delete a place by ID
 *     description: Deletes a place specified by its ID. Requires admin access with valid access and refresh tokens in cookies.
 *     tags:
 *       - place
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
 *         description: place ID to delete
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       403:
 *         description: You have not access to this route or place not found
 *       422:
 *         description: Validation error
 */
router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddleware, placeController.remove);

/**
 * @swagger
 * /v1/place/{id}:
 *   put:
 *     summary: Update place information
 *     description: Updates the information of a place specified by its ID. Requires admin access with valid access and refresh tokens in cookies.
 *     tags:
 *       - place
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
 *         description: place ID to update
 *     responses:
 *       200:
 *         description: Successfully updated
 *       403:
 *         description: You have not access to this route or place not found
 *       422:
 *         description: Validation error
 */
router
  .route("/:id")
  .put(authMiddleware, isAdminMiddleware, placeController.update);

export default router