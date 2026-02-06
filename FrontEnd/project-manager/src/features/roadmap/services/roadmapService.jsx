import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const roadmapService = {
  // Roadmaps CRUD
  getRoadmaps: (params) =>
    api.get(`${ENDPOINTS.ROADMAPS}/`, { params }),

  createRoadmap: (data) =>
    api.post(`${ENDPOINTS.ROADMAPS}/`, data),

  updateRoadmap: (id, data) =>
    api.put(`${ENDPOINTS.ROADMAPS}/${id}/`, data),

  deleteRoadmap: (id) =>
    api.delete(`${ENDPOINTS.ROADMAPS}/${id}/`),

  getRoadmapById: (id) =>
    api.get(`${ENDPOINTS.ROADMAPS}/${id}/`),

  // Milestones
  getMilestones: (roadmapId) =>
    api.get(`${ENDPOINTS.ROADMAPS}/${roadmapId}/milestones/`),

  createMilestone: (roadmapId, data) =>
    api.post(`${ENDPOINTS.ROADMAPS}/${roadmapId}/milestones/`, data),

  updateMilestone: (roadmapId, milestoneId, data) =>
    api.put(`${ENDPOINTS.ROADMAPS}/${roadmapId}/milestones/${milestoneId}/`, data),

  deleteMilestone: (roadmapId, milestoneId) =>
    api.delete(`${ENDPOINTS.ROADMAPS}/${roadmapId}/milestones/${milestoneId}/`),

  toggleMilestoneStatus: (roadmapId, milestoneId) =>
    api.patch(`${ENDPOINTS.ROADMAPS}/${roadmapId}/milestones/${milestoneId}/toggle/`),

  // Notes/Learnings
  getNotes: (params) =>
    api.get(`${ENDPOINTS.ROADMAP_NOTES}/`, { params }),

  createNote: (data) =>
    api.post(`${ENDPOINTS.ROADMAP_NOTES}/`, data),

  updateNote: (id, data) =>
    api.put(`${ENDPOINTS.ROADMAP_NOTES}/${id}/`, data),

  deleteNote: (id) =>
    api.delete(`${ENDPOINTS.ROADMAP_NOTES}/${id}/`),

  // Statistics
  getRoadmapStats: () =>
    api.get(`${ENDPOINTS.ROADMAPS}/stats/`),

  getProgressReport: (roadmapId) =>
    api.get(`${ENDPOINTS.ROADMAPS}/${roadmapId}/progress/`),
};