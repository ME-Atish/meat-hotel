import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST!,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  dialect: "mysql",
  logging: false,
});

sequelize.sync({ alter: true });

const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("connect to db successfully");
  } catch (error) {
    if (error) throw error;
  }
};

connectToDb();

export default sequelize;
