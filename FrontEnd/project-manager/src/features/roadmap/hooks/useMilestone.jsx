import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInfiniteList from '../../../shared/hooks/useInfiniteList';
import { roadmapService } from "../services/roadmapService";

export function useMilestone(roadmapId) {
  const queryClient = useQueryClient();

  const getInfiniteMilestones = () =>
    useInfiniteList(
      ["roadmaps", roadmapId, "milestones", "infinite"],
      (params) => {
        if (!roadmapId) return [];
        return roadmapService.getMilestones(roadmapId, { ...params, page_size: 10 });
      },
      [roadmapId]
    );

  const createMilestone = useMutation({
    mutationFn: ({ roadmapId: id, data }) => roadmapService.createMilestone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones", "infinite"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const updateMilestone = useMutation({
    mutationFn: ({ roadmapId: id, milestoneId, data }) =>
      roadmapService.updateMilestone(id, milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones", "infinite"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const deleteMilestone = useMutation({
    mutationFn: ({ milestoneId }) =>
      roadmapService.deleteMilestone(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmaps", roadmapId, "milestones", "infinite"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const toggleMilestone = useMutation({
    mutationFn: ({ milestoneId, isCompleted }) =>
      roadmapService.toggleMilestoneStatus(milestoneId, isCompleted),
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
    getInfiniteMilestones,
  };
}
