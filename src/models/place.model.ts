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
      field: "is_reserved"
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
        model: "Users",
        key: "id",
      },
      field: "owner_id",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: true,
    modelName: "Place",
    tableName: "Places",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

User.hasMany(Place , {foreignKey: "owner_id", sourceKey: "id", as: "places"});
Place.belongsTo(User,{
  foreignKey: "ownerId", targetKey: "id", as: "owner"
});

export default Place;
