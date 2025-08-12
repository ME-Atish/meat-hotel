import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import userModel from "../models/user.model.js";
import walletModel from "../models/wallet.model.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `http://localhost:${process.env
      .PORT!}/v1/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails![0].value;
    let user = await userModel.findOne({
      where: {
        email,
      },
    });

    if (user) return done(null, user);

    const firstName = profile.name?.givenName;
    const lastName = profile.name?.familyName
      ? profile.name?.familyName
      : `${firstName}Family`;
    const username =
      `${firstName} ${lastName}`.replace(/[\.-]/, "") +
      Math.floor(1000 + Math.random() * 9000);

    const newUser = await userModel.create({
      username,
      firstName,
      lastName,
      email,
      role: "USER",
      isReserved: false,
      provider: "google",
    });

    walletModel.create({
      userId: newUser.dataValues.id,
    });

    return done(null, newUser);
  }
);

export default googleStrategy;
