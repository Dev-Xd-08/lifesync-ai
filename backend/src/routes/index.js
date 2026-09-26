const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const documentRoutes = require("./documentRoutes");
const expenseRoutes = require("./expenseRoutes");
const healthRoutes = require("./healthRoutes");
const taskRoutes = require("./taskRoutes");
const aiRoutes = require("./aiRoutes");
const statsRoutes = require("./statsRoutes");

// Health check endpoint
router.get("/health-check", (req, res) => {
  const { getMongoStatus } = require("../config/db");
  res.json({
    status: "ok",
    service: "LifeSync AI REST API Gateway",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    database: getMongoStatus() ? "MongoDB Connected" : "Resilient Local Store"
  });
});

// Primary API v1 Route Mounts
router.use("/auth", authRoutes);
router.use("/documents", documentRoutes);
router.use("/expenses", expenseRoutes);
router.use("/health", healthRoutes);
router.use("/tasks", taskRoutes);
router.use("/ai", aiRoutes);
router.use("/stats", statsRoutes);

module.exports = router;
