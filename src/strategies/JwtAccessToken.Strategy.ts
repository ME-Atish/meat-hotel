import { Strategy as JwtStrategy } from "passport-jwt";
import { Request } from "express";

const cookieExtractor = (req: Request): string | null => {
  const token = req?.cookies?.accessToken ?? null;
  return token;
}


import userModel from "../models/user.model.js";
const accessTokenStrategy = new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
    algorithms: ['HS512']
  },
  async (payload, done) => {
    const email: string = payload.email

    const user = await userModel.findOne({
      where: {
        email
      },
      raw: true,
    })

    console.log(payload)

    done(null, user);
  }
);

export default accessTokenStrategy;
