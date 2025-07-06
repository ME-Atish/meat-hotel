import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import AuthenticationRequest from "../utils/authReq.js";
import userModel from "../models/user.model.js";

/**
 * Check is the users that send request admin or not
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @return void
 */
export default async (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.refresh_token) {
    return res
      .status(403)
      .json({ message: "You have not access to this route" });
  }

  interface RefreshToken extends jwt.JwtPayload {
    email: string;
  }

  const token = jwt.verify(
    req.cookies.refresh_token,
    process.env.REFRESH_TOKEN_SECRET!
  ) as RefreshToken;
  
  const user = await userModel.findOne({ email: token.email });

  if (!user) {
    return res.status(403).json({ Message: "User not found" });
  }

  if (user.role === "USER") {
    return res
      .status(403)
      .json({ message: "You have not access to this route" });
  }

  // Save the user's/admin's information in req.user
  req.user = user;

  next();
};
