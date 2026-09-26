import api from "./api";

export const healthService = {
  async getHealthRecords() {
    const res = await api.get("/health");
    return res.data;
  },

  async createHealthRecord(data) {
    const res = await api.post("/health", data);
    return res.data;
  },

  async deleteHealthRecord(id) {
    const res = await api.delete(`/health/${id}`);
    return res.data;
  }
};

export default healthService;
