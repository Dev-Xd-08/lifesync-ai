const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const { authenticateToken } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.use(authenticateToken);

router.get("/", documentController.getDocuments);
router.post("/", upload.single("file"), documentController.uploadDocument);
router.get("/:id/download", documentController.downloadDocument);
router.delete("/:id", documentController.deleteDocument);

module.exports = router;
