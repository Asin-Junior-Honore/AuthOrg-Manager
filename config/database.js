const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from .env file
const pg = require("pg");
// let sequelize;

// For production deployment on Render.com or similar

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});
// // For local development
// sequelize = new Sequelize(
//   process.env.LOCAL_DB_NAME,
//   process.env.LOCAL_DB_USER,
//   process.env.LOCAL_DB_PASSWORD,
//   {
//     host: process.env.LOCAL_DB_HOST,
//     dialect: "postgres",
//     operatorsAliases: false,
//   }
// );

module.exports = { sequelize };
