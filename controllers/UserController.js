const { Organisation, User } = require("../models");

class UserController {
  static async getUserById(req, res) {
    const { id } = req.params;
    const { userId } = req.user;

    try {
      let user;

      if (id === userId) {
        user = await User.findByPk(userId);
      } else {
        // Implement additional logic to check permissions, if necessary
        user = await User.findByPk(id, {
          include: { model: Organisation }, // Adjust conditions as needed
        });
      }

      if (!user) {
        return res.status(404).json({
          status: "Not found",
          message: "User not found",
          statusCode: 404,
        });
      }

      const userData = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      };

      res.status(200).json({
        status: "success",
        message: "User data fetched successfully",
        data: userData,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({
        status: "Error",
        message: "Server error",
        statusCode: 500,
      });
    }
  }
}

module.exports = UserController;
