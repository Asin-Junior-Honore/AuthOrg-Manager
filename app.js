const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./config/database");
const dotenv = require("dotenv");
const routes = require("./routes");

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>👋 Hello! Go on and explore the app, thanks ✌️</h1>");
});

app.use("/", routes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

module.exports = app;
