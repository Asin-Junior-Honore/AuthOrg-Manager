const express = require("express");
const UserController = require("../controllers/UserController");
const AuthController = require("../controllers/authController");
const OrganisationController = require("../controllers/organisationController");
const AuthMiddleware = require("../middlewares/authenticate");

const router = express.Router();

// Authentication routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// User routes
router.get(
  "/api/users/:id",
  AuthMiddleware.authenticate,
  UserController.getUserById
);

// Organisation routes
router.get(
  "/api/organisations",
  AuthMiddleware.authenticate,
  OrganisationController.getOrganisations
);
router.post(
  "/api/organisations",
  AuthMiddleware.authenticate,
  OrganisationController.createOrganisation
);
router.get(
  "/api/organisations/:orgId",
  AuthMiddleware.authenticate,
  OrganisationController.getOrganisationById
);
router.post(
  "/api/organisations/:orgId/users",
  AuthMiddleware.authenticate,
  OrganisationController.addUserToOrganisation
);

module.exports = router;
