const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

const UserOrganisation = sequelize.define("UserOrganisation", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'User', // Specify the model name as a string
      key: "userId",
    },
  },
  orgId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Organisation', // Specify the model name as a string
      key: "orgId",
    },
  },
});

module.exports = UserOrganisation;
