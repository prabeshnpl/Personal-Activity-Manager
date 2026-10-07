import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const roadmapService = {
  // Roadmaps CRUD
  getRoadmaps: (params) =>
    api.get(`${ENDPOINTS.ROADMAPS}/`, { params }),

  createRoadmap: (data) =>
    api.post(`${ENDPOINTS.ROADMAPS}/`, data),

  updateRoadmap: (id, data) =>
    api.patch(`${ENDPOINTS.ROADMAPS}/${id}/`, data),

  deleteRoadmap: (id) =>
    api.delete(`${ENDPOINTS.ROADMAPS}/${id}/`),

  getRoadmapById: (id) =>
    api.get(`${ENDPOINTS.ROADMAPS}/${id}/`),
};
