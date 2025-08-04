import { DataTypes } from "sequelize";

import db from "../config/db.js";
import User from "./user.model.js";
import Place from "./place.model.js";

const Reserve = db.define(
  "Reserve",
  {
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

User.belongsToMany(Place, { through: "Reserves" });
Place.belongsToMany(User, { through: "Reserves" });

export default Reserve;
