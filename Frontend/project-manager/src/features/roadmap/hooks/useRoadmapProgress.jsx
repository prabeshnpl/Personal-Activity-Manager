import { useQuery } from "@tanstack/react-query";
import { roadmapStatsService } from "../services/roadmapStatsService";

export function useRoadmapProgress(roadmapId) {
  const progress = useQuery({
    queryKey: ["roadmaps", roadmapId, "progress"],
    queryFn: () => roadmapStatsService.getProgressReport(roadmapId),
    enabled: !!roadmapId,
  });

  return {
    progress: progress.data?.data || null,
    isLoadingProgress: progress.isLoading,
  };
}
