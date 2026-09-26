const DataStore = require("../database/store");

const statsController = {
  // GET /api/v1/stats
  async getDashboardStats(req, res, next) {
    try {
      const userId = req.user.id;

      const [docs, expenses, tasks, health] = await Promise.all([
        DataStore.documents.findByUser(userId),
        DataStore.expenses.findByUser(userId),
        DataStore.tasks.findByUser(userId),
        DataStore.healthRecords.findByUser(userId)
      ]);

      const analytics = await DataStore.expenses.getAnalytics(userId);

      const pendingTasks = tasks.filter((t) => t.status !== "completed");
      const urgentTasks = pendingTasks.filter((t) => t.priority === "high");

      // Build unified recent activity feed
      const activity = [];

      docs.slice(0, 3).forEach((d) => {
        activity.push({
          id: d._id,
          type: "document",
          title: `Document Uploaded: ${d.title}`,
          subtitle: d.category,
          date: d.createdAt,
          icon: "FileText"
        });
      });

      expenses.slice(0, 3).forEach((e) => {
        activity.push({
          id: e._id,
          type: "expense",
          title: `${e.type === "income" ? "+" : "-"}$${e.amount.toFixed(2)}: ${e.description}`,
          subtitle: e.category,
          date: e.date,
          icon: "Receipt"
        });
      });

      tasks.slice(0, 3).forEach((t) => {
        activity.push({
          id: t._id,
          type: "task",
          title: `Task: ${t.title}`,
          subtitle: `Status: ${t.status}`,
          date: t.createdAt,
          icon: "CheckSquare"
        });
      });

      health.slice(0, 2).forEach((h) => {
        activity.push({
          id: h._id,
          type: "health",
          title: `Health Log: ${h.title}`,
          subtitle: h.recordType,
          date: h.recordDate,
          icon: "HeartPulse"
        });
      });

      // Sort activity by date desc
      activity.sort((a, b) => new Date(b.date) - new Date(a.date));

      res.json({
        success: true,
        stats: {
          totalDocuments: docs.length,
          totalExpenses: analytics.totalSpent,
          totalIncome: analytics.totalIncome,
          netSavings: analytics.netSavings,
          pendingTasks: pendingTasks.length,
          urgentTasks: urgentTasks.length,
          healthRecords: health.length,
          categoryBreakdown: analytics.categoryBreakdown,
          recentActivity: activity.slice(0, 6)
        }
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = statsController;
