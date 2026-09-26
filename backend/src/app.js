const express = require("express");
const { helmetMiddleware, rateLimiter, corsMiddleware } = require("./middlewares/security");
const errorHandler = require("./middlewares/errorHandler");
const apiV1Router = require("./routes/index");

const app = express();

// Security Middlewares
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimiter);

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request Logger (Development / Viva visibility)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== "test") {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Primary REST API v1
app.use("/api/v1", apiV1Router);

// Backward Compatibility for legacy /api routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "LifeSync AI Server is running!" });
});
app.use("/api", apiV1Router);

// 404 Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Centralized Error Handler
app.use(errorHandler);

module.exports = app;
