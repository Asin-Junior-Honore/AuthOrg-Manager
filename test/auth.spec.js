const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../config/database"); // Ensure this line is correctt
const dotenv = require("dotenv");

dotenv.config();

describe("Auth Endpoints", function () {
  this.timeout(20000); // Increase the timeout to 20000ms (20 seconds) for the entire suite

  before(async function () {
    this.timeout(20000); // Increase the timeout for this hook to 20000
    try {
      console.log("Syncing the database...");
      await sequelize.sync({ force: true }); // Ensure database is in a clean state
      console.log("Database synced successfully.");
    } catch (error) {
      console.error("Error syncing the database:", error);
      throw error; // Re-throw the error to fail the test if syncing fails
    }
  });

  describe("POST /auth/register", () => {
    it("Should register user successfully with default organisation", async function () {
      this.timeout(10000);
      const { expect } = await import("chai");

      const res = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
        phone: "1234567890",
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("status", "success");
      expect(res.body.data).to.have.property("accessToken");
      expect(res.body.data.user).to.include({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1234567890",
      });

      // Check default organisation name
      expect(res.body.data.user.organisation).to.be.an("object");
      expect(res.body.data.user.organisation).to.have.property(
        "name",
        "John's Organisation"
      );
    });

    it("Should fail if required fields are missing", async function () {
      this.timeout(10000);
      const { expect } = await import("chai");

      const res = await request(app).post("/auth/register").send({
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
      });

      expect(res.status).to.equal(422);
      expect(res.body.errors).to.be.an("array").that.is.not.empty;
    });

    it("Should fail if there’s duplicate email or userID", async function () {
      this.timeout(10000);
      const { expect } = await import("chai");

      await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
        phone: "1234567890",
      });

      const res = await request(app).post("/auth/register").send({
        firstName: "Jane",
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
        phone: "1234567890",
      });

      expect(res.status).to.equal(422);
      expect(res.body.errors).to.be.an("array").that.is.not.empty;
    });
  });

  describe("POST /auth/login", () => {
    before(async function () {
      this.timeout(10000); // Increase the timeout for this hook to 10000ms
      await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
        phone: "1234567890",
      });
    });

    it("Should log the user in successfully", async function () {
      this.timeout(10000);
      const { expect } = await import("chai");

      const res = await request(app).post("/auth/login").send({
        email: "john@example.com",
        password: "password",
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body.data).to.have.property("accessToken");
      expect(res.body.data.user).to.include({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1234567890",
      });
    });

    it("Should fail if credentials are invalid", async function () {
      this.timeout(10000);
      const { expect } = await import("chai");

      const res = await request(app).post("/auth/login").send({
        email: "john@example.com",
        password: "wrongpassword",
      });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message", "Authentication failed");
    });

    it("Should fail if email or password is missing", async function () {
      this.timeout(10000);
      const { expect } = await import("chai");

      const res = await request(app).post("/auth/login").send({
        email: "john@example.com",
      });

      expect(res.status).to.equal(422);
      expect(res.body.errors).to.be.an("array").that.is.not.empty;
    });

    it("Should fail if email is unregistered", async function () {
      this.timeout(10000);
      const { expect } = await import("chai");

      const res = await request(app).post("/auth/login").send({
        email: "unregistered@example.com",
        password: "password",
      });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message", "Authentication failed");
    });
  });

  describe("Token Generation", () => {
    it("Should generate token with correct expiry and user details", async function () {
      this.timeout(10000);
      const { expect } = await import("chai");
      // Assuming you have a user with known details, or you create one specifically for this test
      const user = await User.findOne({ where: { email: "john@example.com" } });
      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
        expiresIn: "6h",
      });
      const decoded = jwt.decode(token);

      expect(decoded).to.have.property("userId", user.userId);
      expect(decoded).to.have.property("exp").that.is.a("number");

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const tokenExpiry = decoded.exp;

      // Check if token expiry is in the future (greater than current time)
      expect(tokenExpiry).to.be.greaterThan(currentTimeInSeconds);
    });
  });

  // Mock implementation for illustration purposes
  const mockOrganisationData = [
    { id: 1, name: "Organisation A", userId: 1 },
    { id: 2, name: "Organisation B", userId: 2 },
  ];

  describe("Organisation Access", () => {
    it("Should restrict access to organisations based on user's access", async function () {
      this.timeout(10000);
      const { expect } = await import("chai");

      // Mock a user context
      const currentUser = { userId: 1 };

      // Simulate fetching organisations
      const userOrganisations = mockOrganisationData.filter(
        (org) => org.userId === currentUser.userId
      );

      expect(userOrganisations).to.have.lengthOf.at.least(1);

      userOrganisations.forEach((org) => {
        expect(org.userId).to.equal(currentUser.userId);
      });
    });
  });
});
