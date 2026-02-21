import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInfiniteList from '../../../shared/hooks/useInfiniteList';
import { roadmapService } from "../services/roadmapService";

export function useRoadmapNotes(roadmapId) {
  const queryClient = useQueryClient();

  const useInfiniteNotes = () =>
    useInfiniteList(
      ["roadmap-notes", roadmapId, "infinite"],
      (params) => {
        if (!roadmapId) return [];
        return roadmapService.getNotes({ roadmap: roadmapId, ...params, page_size: 10 });
      },
      [roadmapId]
    );

  const createNote = useMutation({
    mutationFn: roadmapService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes", roadmapId, "infinite"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const updateNote = useMutation({
    mutationFn: ({ id, data }) => roadmapService.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes", roadmapId, "infinite"]);
    },
  });

  const deleteNote = useMutation({
    mutationFn: roadmapService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes", roadmapId, "infinite"]);
    },
  });

  return {
    createNote,
    updateNote,
    deleteNote,
    useInfiniteNotes,
  };
}
