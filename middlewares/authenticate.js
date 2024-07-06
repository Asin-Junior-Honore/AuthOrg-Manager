const jwt = require("jsonwebtoken");

class AuthMiddleware {
  static authenticate(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "No token provided",
        statusCode: 401,
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        status: "Unauthorized",
        message: "Invalid token",
        statusCode: 401,
      });
    }
  }
}

module.exports = AuthMiddleware;
