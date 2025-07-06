import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import authenticationRequest from "../utils/authReq.js";
import userModel from "../models/user.model.js";

/**
 * Check is the user login to this website or not
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @return void
 */
export default async (
  req: authenticationRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.access_token) {
    return res
      .status(403)
      .json({ message: "You have not access to this route" });
  }

  interface AccessToken extends jwt.JwtPayload {
    email: string;
  }

  const token = jwt.verify(
    req.cookies.access_token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as AccessToken;

  const user = await userModel.findOne({ email: token.email });

  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }

  // Save user's/admin's information into req.user
  req.user = user;

  next();
};
