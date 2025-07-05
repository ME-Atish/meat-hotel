const express = require("express");
const multer = require("multer");

const hotelController = require("../../controllers/v1/hotel.controller");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const isAdminMiddlewares = require("../../middlewares/isAdmin.middlewares.js");
const multerStorage = require("../../utils/uploader.js");

const router = express.Router();

/**
 * @swagger
 * /v1/hotel:
 *   get:
 *     summary: Get all hotels
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
 *     tags: [Hotel]
 *     responses:
 *       200:
 *         description: List of hotels returned successfully
 *       403:
 *          description: User not found or you have not access to this route
 */

router
  .route("/")
  .get(authMiddleware, isAdminMiddlewares, hotelController.getAll);

/**
 * @swagger
 * /v1/hotel:
 *   post:
 *     summary: Create a new hotel
 *     description: Creates a new hotel with the provided details and images. Requires access token in cookie.
 *     tags:
 *       - Hotel
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
 *                 description: Name of the hotel
 *                 example: Hotel Sunshine
 *               address:
 *                 type: string
 *                 description: Address of the hotel
 *                 example: 123 Main St
 *               description:
 *                 type: string
 *                 description: Description of the hotel
 *                 example: A cozy and comfortable hotel
 *               facilities:
 *                 type: string
 *                 description: facilities of hotel
 *                 example: "pool, bedroom, kitchen"
 *               price:
 *                 type: number
 *                 description: Price per night
 *                 example: 150000
 *               province:
 *                 type: string
 *                 description: Province where the hotel is located
 *                 example: Ontario
 *               city:
 *                 type: string
 *                 description: City where the hotel is located
 *                 example: Toronto
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Up to 5 images of the hotel
 *     responses:
 *       201:
 *         description: Hotel created successfully
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
    hotelController.create
  );

/**
 * @swagger
 * /v1/reserve/{id}:
 *   post:
 *     summary: Reserve a hotel
 *     description: Reserve a hotel by its ID. Requires access token in cookie for authentication.
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
 *         description: Hotel ID to reserve
 *     responses:
 *       200:
 *         description: Hotel reserved successfully
 *       422:
 *         description: Validation error
 *       409:
 *         description: Hotel already reserved or user already has a reservation for this hotel
 */
router.route("/reserve/:id").post(authMiddleware, hotelController.reserve);

/**
 * @swagger
 * /v1/reserve/{id}/cancel:
 *   post:
 *     summary: Cancel a hotel reservation
 *     description: Cancels an existing hotel reservation by hotel ID. Requires access token in cookie for authentication.
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
 *         description: Hotel ID to cancel
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
  .post(authMiddleware, hotelController.cancelReservation);

/**
 * @swagger
 * /v1/hotel/{id}:
 *   delete:
 *     summary: Delete a hotel by ID
 *     description: Deletes a hotel specified by its ID. Requires admin access with valid access and refresh tokens in cookies.
 *     tags:
 *       - Hotel
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
 *         description: Hotel ID to delete
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       403:
 *         description: You have not access to this route or hotel not found
 *       422:
 *         description: Validation error
 */
router
  .route("/:id")
  .delete(authMiddleware, isAdminMiddlewares, hotelController.delete);

/**
 * @swagger
 * /v1/hotel/{id}:
 *   put:
 *     summary: Update hotel information
 *     description: Updates the information of a hotel specified by its ID. Requires admin access with valid access and refresh tokens in cookies.
 *     tags:
 *       - Hotel
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
 *         description: Hotel ID to update
 *     responses:
 *       200:
 *         description: Successfully updated
 *       403:
 *         description: You have not access to this route or hotel not found
 *       422:
 *         description: Validation error
 */
router
  .route("/:id")
  .put(authMiddleware, isAdminMiddlewares, hotelController.update);

module.exports = router;
