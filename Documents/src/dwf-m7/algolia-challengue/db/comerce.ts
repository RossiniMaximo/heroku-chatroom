import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";

export class Comerce extends Model {}
Comerce.init(
  {
    name: DataTypes.STRING,
    area: DataTypes.STRING,
    lat: DataTypes.DATE,
    lng: DataTypes.DATE,
  },
  { sequelize, modelName: "Comerce" }
);
