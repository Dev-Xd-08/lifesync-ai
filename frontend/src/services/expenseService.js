import api from "./api";

export const expenseService = {
  async getExpenses(params = {}) {
    const res = await api.get("/expenses", { params });
    return res.data;
  },

  async createExpense(data) {
    const res = await api.post("/expenses", data);
    return res.data;
  },

  async deleteExpense(id) {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
  },

  async getAnalytics() {
    const res = await api.get("/expenses/analytics");
    return res.data;
  }
};

export default expenseService;
