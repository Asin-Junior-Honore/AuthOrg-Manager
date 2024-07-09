const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");

const Organisation = sequelize.define("Organisation", {
  orgId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  UserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "userId",
    },
  },
});

module.exports = Organisation;
