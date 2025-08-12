import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

import userModel from "../models/user.model.js";

const localStrategy = new LocalStrategy(
  { usernameField: "identifier" },
  async (identifier, password, done) => {
    const user = await userModel.findOne({
      where: {
        [Op.or]: {
          username: identifier,
          email: identifier,
        },
      },
    });

    if (!user) return done(null, false);

    const isPasswordValid = await bcrypt.compare(
      password,
      user.dataValues.password
    );
    if (!isPasswordValid) return done(null, false);

    return done(null, user);
  }
);

export default localStrategy;
