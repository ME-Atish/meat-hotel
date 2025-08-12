const sequelizeConfig = {
  development: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    host: process.env.DB_HOST!,
    dialect: "mysql",
    port: 3306,
  },
  test: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    host: process.env.DB_HOST!,
    dialect: "mysql",
    port: 3306,
  },
  production: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    host: process.env.DB_HOST!,
    dialect: "mysql",
    port: 3306,
  },
};

export default sequelizeConfig;
