const express = require("express");

const searchController = require("../../controllers/v1/search.controller");

const router = express.Router();

/**
 * @swagger
 * /v1/search/{keyword}:
 *   get:
 *     summary: Search the website
 *     description: Searches the website using the provided keyword.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Keyword to search for
 *     responses:
 *       200:
 *         description: Show the result of search
 *
 */
router.route("/:keyword").get(searchController.get);

module.exports = router;
