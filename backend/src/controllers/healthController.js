const DataStore = require("../database/store");
const aiService = require("../services/aiService");

const healthController = {
  // GET /api/v1/health
  async getHealthRecords(req, res, next) {
    try {
      const records = await DataStore.healthRecords.findByUser(req.user.id);
      res.json({
        success: true,
        count: records.length,
        healthRecords: records
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/health
  async createHealthRecord(req, res, next) {
    try {
      const { title, recordType, recordDate, vitals, tags, notes } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          error: "Title is required for health record."
        });
      }

      // Generate AI summary & compliance disclaimer
      const aiSummary = await aiService.summarizeMedicalRecord(title, vitals, notes);

      const record = await DataStore.healthRecords.create({
        userId: req.user.id,
        title: title.trim(),
        recordType: recordType || "Vitals",
        recordDate: recordDate ? new Date(recordDate) : new Date(),
        vitals: vitals || {},
        tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : [],
        notes: notes || "",
        aiSummary
      });

      res.status(201).json({
        success: true,
        message: "Health record and AI summary generated successfully.",
        healthRecord: record
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/v1/health/:id
  async deleteHealthRecord(req, res, next) {
    try {
      const removed = await DataStore.healthRecords.delete(req.params.id, req.user.id);
      if (!removed) {
        return res.status(404).json({
          success: false,
          error: "Health record not found or access denied."
        });
      }

      res.json({
        success: true,
        message: "Health record removed successfully."
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = healthController;
