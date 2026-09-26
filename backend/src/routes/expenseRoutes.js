const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const { authenticateToken } = require("../middlewares/auth");

router.use(authenticateToken);

router.get("/", expenseController.getExpenses);
router.post("/", expenseController.createExpense);
router.get("/analytics", expenseController.getAnalytics);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
