const express = require("express");
const app = express();

const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const authRouter = require("./routers/v1/auth.router");

app.use(cors());
app.use(express.json());
app.use(cookieParser("dpajaedafqep."));
app.use(
  session({
    secret: "dawpjdawjp",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/v1/auth", authRouter);

app.use((err, req, res, next) => {
  return res.status(500).json({
    message: err.message || "Server Error",
  });
});

module.exports = app;
