const mongoose = require("mongoose");
const env = require("./env");

let isMongoConnected = false;

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    
    // Connection options with low timeout for rapid fallback if offline
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 2500, // 2.5 seconds timeout
    });

    isMongoConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️  MongoDB connection error: ${error.message}`);
    console.info(`💡 Note: Running in Resilient Fallback Store Mode. All API routes, Auth, OCR, and AI features will function smoothly!`);
    console.info(`   To use MongoDB Atlas, configure MONGODB_URI in backend/.env`);
    return false;
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = {
  connectDB,
  getMongoStatus
};
