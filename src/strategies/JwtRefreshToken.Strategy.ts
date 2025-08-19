import { Strategy as JwtStrategy } from "passport-jwt";
import { Request } from "express";

import userModel from "../models/user.model.js";

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['refreshToken'] ?? null
  }

  return null;
}

const refreshTokenStrategy = new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS512'],
    passReqToCallback: true,
  },
  async (req, payload, done) => {
    const email: string = payload.email;

    const user = await userModel.findOne({
      where: {
        email
      },
      raw: true,
    })

    if (!user) return done(null, false);

    return done(null, user);
  }
);

export default refreshTokenStrategy