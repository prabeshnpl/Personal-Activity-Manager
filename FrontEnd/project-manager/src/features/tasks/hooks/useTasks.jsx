import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/taskService";
import { useState } from "react";

export function useTasks() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: null, // pending, in_progress, completed
    priority: null, // low, medium, high
    assignedTo: null,
    search: '',
    startDate: null,
    endDate: null,
  });

  // Queries
  const tasks = useQuery({
    queryKey: ["tasks"],
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
  const getTasksByStatus = (status) => useQuery({
    queryKey: ["tasks", status],
    queryFn: () => taskService.getTasks({status}),
  }); 

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