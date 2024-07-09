const { Organisation, User, UserOrganisation } = require("../models");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const {
  createOrganisationSchema,
} = require("../validations/organisationValidation");

class OrganisationController {
  static async getOrganisations(req, res) {
    try {
      const { userId } = req.user;

      // Find all organizations the user is a member of or has created
      const organisations = await Organisation.findAll({
        where: {
          [Sequelize.Op.or]: [{ UserId: userId }, { "$Users.userId$": userId }],
        },
        include: [
          {
            model: User,
            as: "Creator",
            attributes: ["userId", "firstName", "lastName", "email", "phone"],
          },
          {
            model: User,
            through: { attributes: [] }, // To avoid including the join table attributes
            attributes: ["userId", "firstName", "lastName", "email", "phone"],
          },
        ],
      });

      if (!organisations || organisations.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No organisations found",
        });
      }

      res.status(200).json({
        status: "success",
        data: organisations,
      });
    } catch (error) {
      console.error("Error fetching user's organisations:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async createOrganisation(req, res) {
    const { error } = createOrganisationSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        status: "error",
        message: "Validation error",
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
        UserId: userId,
      });

      res.status(201).json({
        status: "success",
        message: "Organisation created successfully",
        data: {
          organisation,
        },
      });
    } catch (error) {
      console.error("Error creating organisation:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async getOrganisationById(req, res) {
    const { orgId } = req.params;

    try {
      const organisation = await Organisation.findOne({
        where: { orgId },
      });

      if (!organisation) {
        return res.status(404).json({
          status: "error",
          message: "Organisation not found",
        });
      }

      // Ensure the user has access to this organisation (optional)

      res.status(200).json({
        status: "success",
        data: {
          organisation,
        },
      });
    } catch (error) {
      console.error("Error fetching organisation:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async addUserToOrganisation(req, res) {
    const { userId: currentUserId } = req.user;
    const { orgId } = req.params;
    const { userId: userToAddId } = req.body;

    try {
      // Check if the organization exists and belongs to the current user
      const organisation = await Organisation.findOne({
        where: { orgId, UserId: currentUserId },
      });

      if (!organisation) {
        return res.status(404).json({
          status: "error",
          message: "Organisation not found or you do not have access",
        });
      }

      // Find the user to be added by userId
      const userToAdd = await User.findOne({ where: { userId: userToAddId } });

      if (!userToAdd) {
        return res.status(404).json({
          status: "error",
          message: "User to be added not found",
        });
      }

      // Check if the user is already part of the organization
      const existingMembership = await UserOrganisation.findOne({
        where: { userId: userToAdd.userId, orgId },
      });

      if (existingMembership) {
        return res.status(400).json({
          status: "error",
          message: "User is already a member of this organisation",
        });
      }

      // Add the user to the organization
      await UserOrganisation.create({
        userId: userToAdd.userId,
        orgId,
      });

      res.status(201).json({
        status: "success",
        message: "User added to organisation successfully",
      });
    } catch (error) {
      console.error("Error adding user to organisation:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

module.exports = OrganisationController;
