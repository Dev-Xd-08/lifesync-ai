const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lifesync_ai",
  jwtSecret: process.env.JWT_SECRET || "lifesync_super_secret_jwt_key_2026_dev",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  uploadDir: path.resolve(__dirname, "../../", process.env.UPLOAD_DIR || "uploads"),
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 15
};

module.exports = env;
