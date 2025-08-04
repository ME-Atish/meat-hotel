import { DataTypes } from "sequelize";

import db from "../config/db.js";

const Wallet = db.define(
  "Wallet",
  {
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    modelName: "Wallet",
    tableName: "Wallets",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Wallet;
