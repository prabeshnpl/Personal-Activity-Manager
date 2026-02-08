import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roadmapService } from "../services/roadmapService";

export function useMilestone(roadmapId) {
  const queryClient = useQueryClient();

  const milestones = useQuery({
    queryKey: ["roadmaps", roadmapId, "milestones"],
    queryFn: () => roadmapService.getMilestones(roadmapId),
    enabled: !!roadmapId,
  });

  const createMilestone = useMutation({
    mutationFn: ({ roadmapId: id, data }) => roadmapService.createMilestone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const updateMilestone = useMutation({
    mutationFn: ({ roadmapId: id, milestoneId, data }) =>
      roadmapService.updateMilestone(id, milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const deleteMilestone = useMutation({
    mutationFn: ({ roadmapId: id, milestoneId }) =>
      roadmapService.deleteMilestone(id, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const toggleMilestone = useMutation({
    mutationFn: ({ roadmapId: id, milestoneId }) =>
      roadmapService.toggleMilestoneStatus(id, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  return {
    milestones: milestones.data?.data || [],
    isLoadingMilestones: milestones.isLoading,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    toggleMilestone,
  };
}
