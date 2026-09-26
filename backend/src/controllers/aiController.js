const DataStore = require("../database/store");
const aiService = require("../services/aiService");

const aiController = {
  // POST /api/v1/ai/chat
  async chat(req, res, next) {
    try {
      const { message } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          error: "Message prompt is required."
        });
      }

      // Gather live user context
      const userId = req.user.id;
      const user = await DataStore.users.findById(userId);
      const expenses = await DataStore.expenses.findByUser(userId);
      const documents = await DataStore.documents.findByUser(userId);
      const tasks = await DataStore.tasks.findByUser(userId);
      const healthRecords = await DataStore.healthRecords.findByUser(userId);

      const contextData = {
        userName: user?.name || "Valued User",
        expenses,
        documents,
        tasks,
        healthRecords
      };

      const reply = await aiService.askCopilot(message.trim(), contextData);

      res.json({
        success: true,
        reply
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = aiController;
