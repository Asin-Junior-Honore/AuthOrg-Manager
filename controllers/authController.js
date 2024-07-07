const { User, Organisation } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");

class AuthController {
  static async register(req, res) {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        errors: error.details.map((detail) => ({
          field: detail.context.key,
          message: detail.message,
        })),
      });
    }

    const { firstName, lastName, email, password, phone } = req.body;

    try {
      // Check if user already exists with the same email
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(422).json({
          errors: [{ field: "email", message: "Email is already registered" }],
        });
      }

      // Check if user already exists with the same firstName
      const existingFirstName = await User.findOne({ where: { firstName } });
      if (existingFirstName) {
        return res.status(422).json({
          errors: [
            { field: "firstName", message: "First name is already taken" },
          ],
        });
      }

      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
      });

      const orgName = `${firstName}'s Organisation`;
      const organisation = await Organisation.create({
        name: orgName,
        description: "",
        UserId: user.userId,
      });

      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
        expiresIn: "6h",
      });

      res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken: token,
          user: {
            userId: user.userId,
            firstName,
            lastName,
            email,
            phone,
            organisation: {
              orgId: organisation.orgId,
              name: organisation.name,
              description: organisation.description,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async login(req, res) {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        errors: error.details.map((detail) => ({
          field: detail.context.key,
          message: detail.message,
        })),
      });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
          status: "Bad request",
          message: "Authentication failed",
          statusCode: 401,
        });
      }

      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          accessToken: token,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email,
            phone: user.phone,
          },
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        status: "Error",
        message: "Server error",
        statusCode: 500,
      });
    }
  }
}

module.exports = AuthController;
