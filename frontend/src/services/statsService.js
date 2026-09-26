import api from "./api";

export const statsService = {
  async getDashboardStats() {
    const res = await api.get("/stats");
    return res.data;
  },

  async getHealthCheck() {
    const res = await api.get("/health-check");
    return res.data;
  }
};

export default statsService;
