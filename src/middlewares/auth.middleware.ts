import { RequestHandler, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthenticationRequest from "../utils/authReq.js";
import userModel from "../models/user.model.js";

const authMiddleware: RequestHandler = async (
  req,
  res: Response,
  next: NextFunction
) => {
  const typedReq = req as AuthenticationRequest;

  if (!typedReq.cookies.access_token) {
    res.status(403).json({ message: "You have not access to this route" });
    return;
  }

  interface AccessToken extends jwt.JwtPayload {
    email: string;
  }

  const token = jwt.verify(
    typedReq.cookies.access_token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as AccessToken;

  const user = await userModel.findOne({
    where: {
      email: token.email,
    },
  });

  if (!user) {
    res.status(403).json({ message: "User not found" });
    return;
  }

  typedReq.user = user.dataValues;
  next();
};

export default authMiddleware;
