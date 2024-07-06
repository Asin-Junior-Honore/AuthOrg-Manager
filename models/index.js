const { sequelize } = require("../config/database");
const User = require("../models/user");
const Organisation = require("../models/organisation");
const UserOrganisation = require("../models/userOrganisation");


User.hasMany(UserOrganisation, {
  foreignKey: "userId",
  as: "UserOrganisations",
});
UserOrganisation.belongsTo(User, { foreignKey: "userId" });

Organisation.hasMany(UserOrganisation, {
  foreignKey: "orgId",
  as: "UserOrganisations",
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
