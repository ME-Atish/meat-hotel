import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import userModel from "@/models/user.model";
import { getAccessTokenSecret } from "~/src/utils/tokens";
import { ValidatedRequest } from "~/src/types/validated-request";

/**
 * Check is the user login to this website or not 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @return void
 */
export default async function AuthMiddleware(req: ValidatedRequest, res: Response, next: NextFunction) {
  if (!req.cookies.access_token) {
    return res
      .status(403)
      .json({ message: "You have not access to this route" });
  }

  const accessTokenSecret = getAccessTokenSecret();

  const token = jwt.verify(
    req.cookies.access_token,
    accessTokenSecret
  );

  const user = await userModel.findOne({ email: token.email });

  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }

  // Save user's/admin's information into req.user
  req.user = user.toObject();

  next();
};
