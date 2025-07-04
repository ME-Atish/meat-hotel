const express = require("express");

const searchController = require("../../controllers/v1/search.controller");

const router = express.Router();

router.route("/:keyword").get(searchController.get);


module.exports= router