import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const milestoneService = {
  getMilestones: (roadmapId, params) =>
    api.get(`${ENDPOINTS.MILESTONE}/`, { params: { roadmap: roadmapId, ...(params || {}) } }),

  createMilestone: (roadmapId, data) =>
    api.post(`${ENDPOINTS.MILESTONE}/`, { ...data, roadmap: roadmapId }),

  updateMilestone: (roadmapId, milestoneId, data) =>
    api.put(`${ENDPOINTS.MILESTONE}/${milestoneId}/`, { ...data, roadmap: roadmapId }),

  deleteMilestone: (milestoneId) =>
    api.delete(`${ENDPOINTS.MILESTONE}/${milestoneId}/`),

  toggleMilestoneStatus: (milestoneId, isCompleted) =>{
    const status = isCompleted ? 'completed' : 'pending';
    return api.patch(`${ENDPOINTS.MILESTONE}/${milestoneId}/`,
      { status: status }
    )
  },
};