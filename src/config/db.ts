import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  host: "localhost",
  username: "root",
  password: "",
  database: "hotel",
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
