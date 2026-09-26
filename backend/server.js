const app = require("./src/app");
const env = require("./src/config/env");
const { connectDB } = require("./src/config/db");

const startServer = async () => {
  // Connect to database (with automatic fallback if local server is offline)
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`
======================================================
  🚀 LifeSync AI REST Gateway Active
  📡 URL: http://localhost:${env.port}
  🔒 Security: Helmet, Rate-Limit, CORS, JWT Bearer
  📂 Storage Vault: ${env.uploadDir}
  🤖 Copilot: ${env.geminiApiKey ? "Gemini 2.5 Flash Connected" : "Local Context Engine Active"}
======================================================
    `);
  });

  // Graceful shutdown handling
  const handleShutdown = (signal) => {
    console.log(`\n[Process] Received ${signal}. Gracefully terminating HTTP server...`);
    server.close(() => {
      console.log("[Process] HTTP server closed cleanly.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
};

startServer().catch((err) => {
  console.error("FATAL: Failed to launch LifeSync AI Server:", err);
  process.exit(1);
});