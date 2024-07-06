const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from .env file

let sequelize;

// For production deployment on Render.com or similar

sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Adjust based on your database configuration
      },
    },
  }
);

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

module.exports = sequelize;
