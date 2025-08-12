import { DataTypes } from "sequelize";

import db from "../config/db.js";

const User = db.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      defaultValue: "USER",
    },
    isReserved: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      field: "is_reserved",
    },
    isOwner: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      field: "is_owner",
    },
    isBan: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      field: "is_ban",
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "refresh_token",
    },
    provider: {
      type: DataTypes.ENUM,
      values: ["local", "google"],
      allowNull: false,
      defaultValue: "local"
    },
    
  },
  {
    modelName: "User",
    tableName: "Users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;
