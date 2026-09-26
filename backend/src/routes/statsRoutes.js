const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const { authenticateToken } = require("../middlewares/auth");

router.use(authenticateToken);

router.get("/", statsController.getDashboardStats);
router.get("/dashboard", statsController.getDashboardStats);

module.exports = router;
