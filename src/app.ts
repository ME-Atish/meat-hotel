import express from "express";
const app = express();

import { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

import authRouter from "./routers/v1/auth.router.js";
import userRouter from "./routers/v1/user.router.js";
import placeRouter from "./routers/v1/place.router.js";
import searchRouter from "./routers/v1/search.router.js";
import walletRouter from "./routers/v1/wallet.router.js";
import ownerRouter from "./routers/v1/owner.router.js";
import configSwagger from "./config/swagger.js";

configSwagger(app);

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
app.use("/v1/place", placeRouter);
app.use("/v1/search", searchRouter);
app.use("/v1/wallet", walletRouter);
app.use("/v1/owner", ownerRouter);

// When path incorrect, these codes will run
app.use((req: Request, res: any) => {
  return res.status(404).json({ message: "Page not found" });
});

// When project got internal error, these codes will run
app.use((err: Error, req: Request, res: any, next: NextFunction) => {
  return res.status(500).json({
    message: err.message || "Server Error",
  });
});

export default app;
