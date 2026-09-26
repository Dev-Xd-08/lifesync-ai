const jwt = require("jsonwebtoken");
const env = require("../config/env");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access denied. Authentication token missing."
    });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded; // { id, email, name }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired session token. Please log in again."
    });
  }
};

module.exports = { authenticateToken };
