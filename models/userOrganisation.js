const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UserOrganisation = sequelize.define("UserOrganisation", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  orgId: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
});

module.exports = UserOrganisation;
