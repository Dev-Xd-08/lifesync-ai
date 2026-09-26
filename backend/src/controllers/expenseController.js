const DataStore = require("../database/store");

const expenseController = {
  // GET /api/v1/expenses
  async getExpenses(req, res, next) {
    try {
      const { category, type } = req.query;
      const expenses = await DataStore.expenses.findByUser(req.user.id, { category, type });
      res.json({
        success: true,
        count: expenses.length,
        expenses
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/expenses
  async createExpense(req, res, next) {
    try {
      const { name, description, amount, category, type, date } = req.body;

      const title = description || name;
      if (!title || amount === undefined || isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({
          success: false,
          error: "Description/Name and a valid positive amount are required."
        });
      }

      const newExpense = await DataStore.expenses.create({
        userId: req.user.id,
        description: title.trim(),
        amount: parseFloat(amount),
        category: category || "General",
        type: type === "income" ? "income" : "expense",
        date: date ? new Date(date) : new Date()
      });

      res.status(201).json({
        success: true,
        message: "Transaction added successfully.",
        expense: newExpense
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/v1/expenses/:id
  async deleteExpense(req, res, next) {
    try {
      const removed = await DataStore.expenses.delete(req.params.id, req.user.id);
      if (!removed) {
        return res.status(404).json({
          success: false,
          error: "Expense record not found or access denied."
        });
      }

      res.json({
        success: true,
        message: "Transaction deleted successfully."
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/expenses/analytics
  async getAnalytics(req, res, next) {
    try {
      const analytics = await DataStore.expenses.getAnalytics(req.user.id);
      res.json({
        success: true,
        analytics
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = expenseController;
