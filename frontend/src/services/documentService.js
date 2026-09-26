import api from "./api";

export const documentService = {
  async getDocuments(params = {}) {
    const res = await api.get("/documents", { params });
    return res.data;
  },

  async uploadDocument(formData) {
    const res = await api.post("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  },

  async downloadDocument(id) {
    const res = await api.get(`/documents/${id}/download`, {
      responseType: "blob"
    });
    return res.data;
  },

  async deleteDocument(id) {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  }
};

export default documentService;
