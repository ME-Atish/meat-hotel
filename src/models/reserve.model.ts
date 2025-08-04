import { DataTypes } from "sequelize";

import db from "../config/db.js";
import User from "./user.model.js";
import Place from "./place.model.js";

const Reserve = db.define(
  "Reserve",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    placeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Places",
        key: "id",
      },
      field: "place_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      field: "user_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    modelName: "Reserve",
    tableName: "Reserves",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

User.belongsToMany(Place, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "user",
  through: Reserve,
});
Place.belongsToMany(User, {
  foreignKey: "placeId",
  sourceKey: "id",
  as: "place",
  through: Reserve,
});

export default Reserve;
