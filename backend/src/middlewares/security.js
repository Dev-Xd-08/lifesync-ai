const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const env = require("../config/env");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again after 15 minutes."
  }
});

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman) or matching origin
    if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1") || origin === env.clientUrl) {
      callback(null, true);
    } else {
      callback(null, true); // Dev flexible origin
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

module.exports = {
  helmetMiddleware: helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }),
  rateLimiter: limiter,
  corsMiddleware: cors(corsOptions)
};
