const { User } = require("../models");

class UserController {
  static async getUserById(req, res) {
    const { id } = req.params;

    try {
      // Fetch the user details based on userId
      const user = await User.findOne({
        where: { userId: id },
      });

      if (!user) {
        return res.status(404).json({
          status: "Error",
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
