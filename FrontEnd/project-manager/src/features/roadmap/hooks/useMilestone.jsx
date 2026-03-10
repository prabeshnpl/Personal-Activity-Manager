import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInfiniteList from '../../../shared/hooks/useInfiniteList';
import { milestoneService } from "../services/milestoneService";

export function useMilestone(roadmapId) {
  const queryClient = useQueryClient();

  const useInfiniteMilestones = () =>
    useInfiniteList(
      ["roadmaps", roadmapId, "milestones", "infinite"],
      (params) => {
        if (!roadmapId) return [];
        return milestoneService.getMilestones(roadmapId, { ...params, page_size: 10 });
      },
      [roadmapId]
    );

  const createMilestone = useMutation({
    mutationFn: ({ roadmapId: id, data }) => milestoneService.createMilestone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones", "infinite"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const updateMilestone = useMutation({
    mutationFn: ({ roadmapId: id, milestoneId, data }) =>
      milestoneService.updateMilestone(id, milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones", "infinite"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const deleteMilestone = useMutation({
    mutationFn: ({ milestoneId }) =>
      milestoneService.deleteMilestone(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones", "infinite"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const toggleMilestone = useMutation({
    mutationFn: ({ milestoneId, isCompleted }) =>
      milestoneService.toggleMilestoneStatus(milestoneId, isCompleted),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones", "infinite"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  return {
    createMilestone,
    updateMilestone,
    deleteMilestone,
    toggleMilestone,
    useInfiniteMilestones,
  };
}
