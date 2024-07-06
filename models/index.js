const { sequelize } = require("../config/database");
const User = require("../models/user");
const Organisation = require("../models/organisation");
const UserOrganisation = require("../models/userOrganisation");

// Define associations
User.hasMany(UserOrganisation, {
  foreignKey: "userId",
  as: "UserOrganisations",
});
UserOrganisation.belongsTo(User, { foreignKey: "userId" });

Organisation.hasMany(UserOrganisation, {
  foreignKey: "orgId",
  as: "UserOrganisations", // Ensure this matches the alias used in UserOrganisation.belongsTo(Organisation, { foreignKey: "orgId" });
});
UserOrganisation.belongsTo(Organisation, { foreignKey: "orgId" });

// Many-to-many relationship through UserOrganisation
User.belongsToMany(Organisation, {
  through: UserOrganisation,
  foreignKey: "userId",
  as: "Organisations",
});
Organisation.belongsToMany(User, {
  through: UserOrganisation,
  foreignKey: "orgId",
  as: "Users",
});

const db = {
  sequelize,
  User,
  Organisation,
  UserOrganisation,
};

module.exports = db;
