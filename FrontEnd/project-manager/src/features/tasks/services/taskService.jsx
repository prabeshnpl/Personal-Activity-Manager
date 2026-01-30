import api from "../../../api/apiClient";
import { ENDPOINTS } from "../../../api/endpoints";

export const taskService = {
  // Tasks CRUD
  getTasks: (params) => 
    api.get(`${ENDPOINTS.TASKS}/`, { params }),

  createTask: (data) =>
    api.post(`${ENDPOINTS.TASKS}/`, data),

  updateTask: (id, data) =>
    api.put(`${ENDPOINTS.TASKS}/${id}/`, data),

  deleteTask: (id) =>
    api.delete(`${ENDPOINTS.TASKS}/${id}/`),

  getTaskById: (id) =>
    api.get(`${ENDPOINTS.TASKS}/${id}/`),

  updateTaskStatus: (id, status) =>
    api.patch(`${ENDPOINTS.TASKS}/${id}/status/`, { status }),

  // Bulk operations
  bulkUpdateTasks: (taskIds, updates) =>
    api.post(`${ENDPOINTS.TASKS}/bulk-update/`, { task_ids: taskIds, updates }),

  bulkDeleteTasks: (taskIds) =>
    api.post(`${ENDPOINTS.TASKS}/bulk-delete/`, { task_ids: taskIds }),
};