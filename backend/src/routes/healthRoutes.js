const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");
const { authenticateToken } = require("../middlewares/auth");

router.use(authenticateToken);

router.get("/", healthController.getHealthRecords);
router.post("/", healthController.createHealthRecord);
router.delete("/:id", healthController.deleteHealthRecord);

module.exports = router;
