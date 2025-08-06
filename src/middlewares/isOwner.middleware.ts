import { RequestHandler, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import AuthenticationRequest from "../utils/authReq.js";
import userModel from "../models/user.model";

const isOwnerMiddleware: RequestHandler = async (
  req,
  res: Response,
  next: NextFunction
) => {
  try {
    const typedReq = req as AuthenticationRequest;

    if (!typedReq.cookies.refresh_token) {
      res.status(403).json({ message: "You have not access to this route" });
      return;
    }

    interface RefreshToken extends jwt.JwtPayload {
      email: string;
    }

    let token: RefreshToken;

    token = jwt.verify(
      typedReq.cookies.refresh_token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshToken;

    if (!token) {
      res.status(403).json({ message: "Invalid or expired token" });
    }

    const user = await userModel.findOne({
      where: {
        email: token.email,
      },
    });

    if (!user) {
      res.status(403).json({ message: "user not found" });
      return;
    }

    if (!user.dataValues.isOwner) {
      res.status(403).json({ message: "You have not access to this route" });
      return;
    }

    typedReq.user = user.dataValues;

    next();
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export default isOwnerMiddleware;
