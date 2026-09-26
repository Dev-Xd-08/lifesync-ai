const DataStore = require("../database/store");

const taskController = {
  // GET /api/v1/tasks
  async getTasks(req, res, next) {
    try {
      const { status, priority } = req.query;
      const tasks = await DataStore.tasks.findByUser(req.user.id, { status, priority });
      res.json({
        success: true,
        count: tasks.length,
        tasks
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/tasks
  async createTask(req, res, next) {
    try {
      const { title, description, priority, dueDate, category, linkedResourceType, linkedResourceId } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          error: "Task title is required."
        });
      }

      const newTask = await DataStore.tasks.create({
        userId: req.user.id,
        title: title.trim(),
        description: description ? description.trim() : "",
        priority: priority || "medium",
        status: "pending",
        dueDate: dueDate ? new Date(dueDate) : null,
        category: category || "General",
        linkedResourceType: linkedResourceType || null,
        linkedResourceId: linkedResourceId || null
      });

      res.status(201).json({
        success: true,
        message: "Task created successfully.",
        task: newTask
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/v1/tasks/:id
  async updateTask(req, res, next) {
    try {
      const { title, description, priority, status, dueDate, category } = req.body;
      const updates = {};

      if (title !== undefined) updates.title = title.trim();
      if (description !== undefined) updates.description = description.trim();
      if (priority !== undefined) updates.priority = priority;
      if (status !== undefined) updates.status = status;
      if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null;
      if (category !== undefined) updates.category = category;

      const updated = await DataStore.tasks.update(req.params.id, req.user.id, updates);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: "Task not found or access denied."
        });
      }

      res.json({
        success: true,
        message: "Task updated successfully.",
        task: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/v1/tasks/:id
  async deleteTask(req, res, next) {
    try {
      const removed = await DataStore.tasks.delete(req.params.id, req.user.id);
      if (!removed) {
        return res.status(404).json({
          success: false,
          error: "Task not found or access denied."
        });
      }

      res.json({
        success: true,
        message: "Task deleted successfully."
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = taskController;
