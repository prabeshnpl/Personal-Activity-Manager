import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/taskService";
import { useState } from "react";

export function useTasks() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: null, // pending, in_progress, completed
    priority: null, // low, medium, high
    assignedTo: null,
    search: null,
    startDate: null,
    endDate: null,
  });

  // Queries
  // Include `filters` in the queryKey so queries refetch when filters change
  const tasks = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => taskService.getTasks(filters),
  });

  // Mutations
  const createTask = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }) => taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const deleteTask = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: ({ id, status }) => taskService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const bulkUpdate = useMutation({
    mutationFn: ({ taskIds, updates }) => taskService.bulkUpdateTasks(taskIds, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const bulkDelete = useMutation({
    mutationFn: taskService.bulkDeleteTasks,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Helper functions
  // Accept overrideFilters so callers can pass the current filters (e.g. search)
  const getTasksByStatus = (status, overrideFilters = null) => {
    const combinedFilters = { ...filters, ...(overrideFilters || {}), status };
    return useQuery({
      queryKey: ["tasks", status, combinedFilters],
      queryFn: () => taskService.getTasks(combinedFilters),
    });
  };

  return {
    // Data
    tasks: tasks,

    // Filters & View
    filters,
    setFilters,

    // Mutations
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    bulkUpdate,
    bulkDelete,

    // Helpers
    getTasksByStatus,
  };
}