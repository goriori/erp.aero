import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../index.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiresIn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAuth: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userAgents: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: "[]",
    },
  },
  {
    sequelize,
  },
);

User.sync({ alter: true });

export default User;
