const express = require("express");
const UserController = require("../controllers/UserController");
const AuthController = require("../controllers/authController");
const OrganisationController = require("../controllers/organisationController");
const AuthMiddleware = require("../middlewares/authenticate");

const router = express.Router();

// Authentication routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// Protected routes group
router.use(AuthMiddleware.authenticate);

// User routes
router.get("/api/users/:id", UserController.getUserById);

// Organisation routes
router.get("/api/organisations", OrganisationController.getOrganisations);
router.post("/api/organisations", OrganisationController.createOrganisation);
router.get(
  "/api/organisations/:orgId",
  OrganisationController.getOrganisationById
);
router.post(
  "/api/organisations/:orgId/users",
  OrganisationController.addUserToOrganisation
);

module.exports = router;
