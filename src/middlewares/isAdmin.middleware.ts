import { RequestHandler, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import AuthenticationRequest from "../utils/authReq.js";
import userModel from "../models/user.model.js";

/**
 * Check if the user sending the request is an admin
 */
const isAdminMiddleware: RequestHandler = async (
  req,
  res: Response,
  next: NextFunction
) => {
  const typedReq = req as AuthenticationRequest;

  if (!typedReq.cookies.refresh_token) {
    res.status(403).json({ message: "You have not access to this route" });
    return;
  }

  interface RefreshToken extends jwt.JwtPayload {
    email: string;
  }

  let token: RefreshToken;
  try {
    token = jwt.verify(
      typedReq.cookies.refresh_token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshToken;
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }

  const user = await userModel.findOne({
    where: {
      email: token.email,
    },
  });

  if (!user) {
    res.status(403).json({ message: "User not found" });
    return;
  }

  if (user.dataValues.isBan) {
    res.status(403).json({ message: "The user is ban" });
    return;
  }

  if (user.dataValues.role === "USER") {
    res.status(403).json({ message: "You have not access to this route" });
    return;
  }

  // Save the user's/admin's information in req.user
  typedReq.user = user.dataValues;

  next();
};

export default isAdminMiddleware;
