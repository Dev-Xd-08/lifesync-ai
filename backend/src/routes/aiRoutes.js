const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { authenticateToken } = require("../middlewares/auth");

router.use(authenticateToken);

router.post("/chat", aiController.chat);

module.exports = router;
