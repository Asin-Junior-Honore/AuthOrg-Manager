const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Organisation extends Model {}

Organisation.init({
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
  },
}, {
  sequelize,
  modelName: 'Organisation',
});

module.exports = Organisation;
