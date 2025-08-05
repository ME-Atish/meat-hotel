import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.MYSQL_URI, {
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
