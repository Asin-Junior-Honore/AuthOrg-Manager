const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./config/database");
const routes = require("./routes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use("/", routes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

module.exports = app;
