const { sequelize } = require("../config/database");
const User = require("./User");
const Organisation = require("./organisation");
const UserOrganisation = require("./UserOrganisation");

User.belongsToMany(Organisation, {
  through: UserOrganisation,
  foreignKey: "userId",
});
Organisation.belongsToMany(User, {
  through: UserOrganisation,
  foreignKey: "orgId",
});

User.hasMany(Organisation, { foreignKey: "UserId", as: "UserOrganisations" });
Organisation.belongsTo(User, { foreignKey: "UserId", as: "Creator" });

module.exports = { User, Organisation, UserOrganisation };

const db = {
  sequelize,
  User,
  Organisation,
  UserOrganisation,
};

module.exports = db;
