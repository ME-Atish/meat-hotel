import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";

import userModel from "../models/user.model.js";

const refreshTokenStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.REFRESH_TOKEN_SECRET!,
    passReqToCallback: true,
  },
  async (req, payload, done) => {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const user = await userModel.findByPk(payload.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) return done(null, false);

    const hashedRefreshToken = user?.dataValues.refreshToken;

    if (!hashedRefreshToken) return done(null, false);

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken!,
      hashedRefreshToken
    );

    if (!isRefreshTokenValid) return done(null, false);

    return done(null, user);
  }
);

export default refreshTokenStrategy