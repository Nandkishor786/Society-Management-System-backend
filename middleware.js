require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Authorization header is missing or doesn't start with 'Bearer '",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error during token verification:", error);
    return res.status(403).json({
      message: "Invalid token or token expired",
    });
  }
};

module.exports = { authMiddleware };
