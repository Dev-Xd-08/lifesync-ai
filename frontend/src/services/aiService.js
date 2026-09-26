import api from "./api";

export const aiService = {
  async askCopilot(message) {
    const res = await api.post("/ai/chat", { message });
    return res.data;
  }
};

export default aiService;
