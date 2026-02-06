import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roadmapService } from "../services/roadmapService";
import { useState } from "react";

export function useRoadmap() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    type: null,
    status: null,
    category: null,
    startDate: null,
    endDate: null,
  });
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  // Queries
  const roadmaps = useQuery({
    queryKey: ["roadmaps", filters],
    queryFn: () => roadmapService.getRoadmaps(filters),
  });

  const stats = useQuery({
    queryKey: ["roadmaps", "stats"],
    queryFn: roadmapService.getRoadmapStats,
  });

  const milestones = useQuery({
    queryKey: ["roadmaps", selectedRoadmap, "milestones"],
    queryFn: () => roadmapService.getMilestones(selectedRoadmap),
    enabled: !!selectedRoadmap,
  });

  const notes = useQuery({
    queryKey: ["roadmap-notes", { roadmap: selectedRoadmap }],
    queryFn: () => roadmapService.getNotes({ roadmap: selectedRoadmap }),
  });

  const progress = useQuery({
    queryKey: ["roadmaps", selectedRoadmap, "progress"],
    queryFn: () => roadmapService.getProgressReport(selectedRoadmap),
    enabled: !!selectedRoadmap,
  });

  // Roadmap Mutations
  const createRoadmap = useMutation({
    mutationFn: roadmapService.createRoadmap,
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const updateRoadmap = useMutation({
    mutationFn: ({ id, data }) => roadmapService.updateRoadmap(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const deleteRoadmap = useMutation({
    mutationFn: roadmapService.deleteRoadmap,
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  // Milestone Mutations
  const createMilestone = useMutation({
    mutationFn: ({ roadmapId, data }) => roadmapService.createMilestone(roadmapId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const updateMilestone = useMutation({
    mutationFn: ({ roadmapId, milestoneId, data }) =>
      roadmapService.updateMilestone(roadmapId, milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const deleteMilestone = useMutation({
    mutationFn: ({ roadmapId, milestoneId }) =>
      roadmapService.deleteMilestone(roadmapId, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const toggleMilestone = useMutation({
    mutationFn: ({ roadmapId, milestoneId }) =>
      roadmapService.toggleMilestoneStatus(roadmapId, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  // Note Mutations
  const createNote = useMutation({
    mutationFn: roadmapService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const updateNote = useMutation({
    mutationFn: ({ id, data }) => roadmapService.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes"]);
    },
  });

  const deleteNote = useMutation({
    mutationFn: roadmapService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes"]);
    },
  });

  return {
    // Data
    roadmaps: roadmaps.data?.data || [],
    stats: stats.data?.data || {
      total_roadmaps: 0,
      active_roadmaps: 0,
      completed_roadmaps: 0,
      total_hours_logged: 0,
      completion_rate: 0,
    },
    milestones: milestones.data?.data || [],
    notes: notes.data?.data || [],
    progress: progress.data?.data || null,

    // Loading states
    isLoading: roadmaps.isLoading,
    isLoadingStats: stats.isLoading,
    isLoadingMilestones: milestones.isLoading,
    isLoadingNotes: notes.isLoading,
    error: roadmaps.error,

    // Filters & Selection
    filters,
    setFilters,
    selectedRoadmap,
    setSelectedRoadmap,

    // Mutations
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    toggleMilestone,
    createNote,
    updateNote,
    deleteNote,

    // Refetch
    refetch: roadmaps.refetch,
  };
}