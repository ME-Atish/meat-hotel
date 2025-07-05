const express = require("express");
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const authRouter = require("./routers/v1/auth.router");
const userRouter = require("./routers/v1/user.router");
const ownerRouter = require("./routers/v1/owner.router");
const hotelRouter = require("./routers/v1/hotel.router");
const searchRouter = require("./routers/v1/search.router");
const configSwagger = require("./config/swagger");

configSwagger(app)

app.use(cors());
app.use(express.json());
// using cookie parser for use cookie in project
app.use(cookieParser("dpajaedafqep."));
// using session for use use cookie and session in project
app.use(
  session({
    secret: "dawpjdawjp",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/owner", ownerRouter);
app.use("/v1/hotel", hotelRouter);
app.use("/v1/search", searchRouter);

// When path incorrect, these codes will run
app.use((req, res) => {
  return res.status(404).json({ message: "Page not found" });
});

// When project got internal error, these codes will run
app.use((err, req, res, next) => {
  return res.status(500).json({
    message: err.message || "Server Error",
  });
});

module.exports = app;
