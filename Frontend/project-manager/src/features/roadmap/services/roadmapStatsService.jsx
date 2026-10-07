import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const roadmapStatsService = {
  getRoadmapStats: () =>
    api.get(`${ENDPOINTS.ROADMAPS}/stats/`),

  getProgressReport: (roadmapId) =>
    api.get(`${ENDPOINTS.ROADMAPS}/${roadmapId}/progress/`),
};