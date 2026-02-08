import { useQuery } from "@tanstack/react-query";
import { roadmapService } from "../services/roadmapService";

export function useRoadmapProgress(roadmapId) {
  const progress = useQuery({
    queryKey: ["roadmaps", roadmapId, "progress"],
    queryFn: () => roadmapService.getProgressReport(roadmapId),
    enabled: !!roadmapId,
  });

  return {
    progress: progress.data?.data || null,
    isLoadingProgress: progress.isLoading,
  };
}
