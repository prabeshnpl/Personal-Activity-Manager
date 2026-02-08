import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roadmapService } from "../services/roadmapService";

export function useRoadmapNotes(roadmapId) {
  const queryClient = useQueryClient();

  const notes = useQuery({
    queryKey: ["roadmap-notes", { roadmap: roadmapId }],
    queryFn: () => roadmapService.getNotes({ roadmap: roadmapId }),
    enabled: !!roadmapId,
  });

  const createNote = useMutation({
    mutationFn: roadmapService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes", { roadmap: roadmapId }]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const updateNote = useMutation({
    mutationFn: ({ id, data }) => roadmapService.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes", { roadmap: roadmapId }]);
    },
  });

  const deleteNote = useMutation({
    mutationFn: roadmapService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes", { roadmap: roadmapId }]);
    },
  });

  return {
    notes: notes.data?.data || [],
    isLoadingNotes: notes.isLoading,
    createNote,
    updateNote,
    deleteNote,
  };
}
