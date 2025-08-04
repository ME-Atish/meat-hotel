import { DataTypes } from "sequelize";

import db from "../config/db.js";
import User from "./user.model.js";

const Place = db.define(
  "Place",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    facilities: DataTypes.STRING,
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    isReserved: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: DataTypes.JSON,
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Owners",
        key: "id",
      },
      field: "owner_id",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: true,
    modelName: "User",
    tableName: "Users",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

User.hasMany(Place);
Place.belongsTo(User);

export default Place;
