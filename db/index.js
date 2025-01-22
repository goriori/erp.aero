import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

const OPTION = {
  dialect: "mysql",
  host: process.env.DB_HOST,
};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  OPTION,
);

sequelize
  .sync({ alter: true })
  .then(() => console.log("connect db"))
  .catch((err) => console.log("err connect db"));

export { sequelize };
