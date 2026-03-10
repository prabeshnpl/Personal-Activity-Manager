import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const roadmapNoteService = {
  getNotes: (params) =>
    api.get(`${ENDPOINTS.ROADMAP_NOTES}/`, { params }),

  createNote: (data) =>
    api.post(`${ENDPOINTS.ROADMAP_NOTES}/`, data),

  updateNote: (id, data) =>
    api.put(`${ENDPOINTS.ROADMAP_NOTES}/${id}/`, data),

  deleteNote: (id) =>
    api.delete(`${ENDPOINTS.ROADMAP_NOTES}/${id}/`),
};