import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import userModel from "../models/user.model.js";

const accessTokenStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
  },
  async (payload, done) => {
    const user = await userModel.findByPk(payload.id, {
      raw: true,
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) done(null, false);

    done(null, user);
  }
);

export default accessTokenStrategy;
