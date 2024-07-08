const { Organisation, User, UserOrganisation  } = require("../models");
const Sequelize =require('sequelize')
const { Op } = Sequelize;
const {
  createOrganisationSchema,
} = require("../validations/organisationValidation");

class OrganisationController {
  static async getOrganisations(req, res) {
    const { userId } = req.user;

    try {
      // Fetch the user details based on userId to get the firstName
      const user = await User.findOne({
        where: { userId },
      });

      if (!user) {
        return res.status(404).json({
          status: "Error",
          message: "User not found",
          statusCode: 404,
        });
      }

      const firstName = user.firstName;

      console.log(
        `Fetching organisations for user with firstName: ${firstName}`
      );

      // Fetch organisations where the user is added based on firstName
      const userOrganisations = await Organisation.findAll({
        include: [
          {
            model: UserOrganisation,
            as: "UserOrganisations",
            include: [
              {
                model: User,
                as: "User", // Include the User model to filter by firstName
                where: { firstName },
              },
            ],
          },
        ],
        where: {
          name: {
            // Filter organisations whose name starts with user's firstName
            [Op.like]: `${firstName}%`,
          },
        },
      });

      res.status(200).json({
        status: "success",
        message: "Organisations fetched",
        data: {
          organisations: userOrganisations,
        },
      });
    } catch (error) {
      console.error("Error fetching organisations:", error);
      res.status(500).json({
        status: "Error",
        message: "Server error",
        statusCode: 500,
      });
    }
  }

  static async createOrganisation(req, res) {
    const { error } = createOrganisationSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        errors: error.details.map((detail) => ({
          field: detail.context.key,
          message: detail.message,
        })),
      });
    }

    const { name, description } = req.body;
    const { userId } = req.user;
    try {
      const organisation = await Organisation.create({
        name,
        description,
        UserId: userId, // Associate the organisation with the user
      });
      res.status(201).json({
        status: "success",
        message: "Organisation created successfully",
        data: { orgId: organisation.orgId, name, description },
      });
    } catch (error) {
      console.error("Error creating organisation:", error);
      res.status(400).json({
        status: "Bad Request",
        message: "Client error",
        statusCode: 400,
      });
    }
  }

  static async getOrganisationById(req, res) {
    const { orgId } = req.params;

    try {
      // Fetch the organization by orgId and ensure it belongs to the current user
      const organisation = await Organisation.findOne({
        where: { orgId },
        include: [
          {
            model: UserOrganisation,
            as: "UserOrganisations",
          },
        ],
      });

      if (!organisation) {
        return res.status(404).json({
          status: "Not found",
          message: "Organisation not found",
          statusCode: 404,
        });
      }

      res.status(200).json({
        status: "Success",
        message: "Organisation data fetched successfully",
        data: {
          organisation: {
            orgId: organisation.orgId,
            name: organisation.name,
            description: organisation.description,
            createdAt: organisation.createdAt,
            updatedAt: organisation.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching organisation data:", error);
      res.status(500).json({
        status: "Error",
        message: "Server error",
        statusCode: 500,
      });
    }
  }

  static async addUserToOrganisation(req, res) {
    const { orgId } = req.params;
    const { userId } = req.body;

    try {
      const organisation = await Organisation.findByPk(orgId);
      if (!organisation) {
        return res.status(404).json({
          status: "Not found",
          message: "Organisation not found",
          statusCode: 404,
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          status: "Not found",
          message: "User not found",
          statusCode: 404,
        });
      }

      const isUserAlreadyInOrganisation = await organisation.hasUser(user);
      if (isUserAlreadyInOrganisation) {
        return res.status(400).json({
          status: "Bad request",
          message: "User is already part of the organisation",
          statusCode: 400,
        });
      }

      await organisation.addUser(user);

      res.status(200).json({
        status: "success",
        message: "User added to organisation successfully",
      });
    } catch (error) {
      console.error("Error adding user to organisation:", error);
      res.status(500).json({
        status: "Error",
        message: "Server error",
        statusCode: 500,
      });
    }
  }
}

module.exports = OrganisationController;
