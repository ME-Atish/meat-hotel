const express = require("express");
const app = express();

const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());



module.exports = app