import { useMutation, useQueryClient } from "@tanstack/react-query";
import useInfiniteList from '../../../shared/hooks/useInfiniteList';
import { roadmapNoteService } from "../services/roadmapNoteService";

export function useRoadmapNotes(roadmapId) {
  const queryClient = useQueryClient();

  const useInfiniteNotes = () =>
    useInfiniteList(
      ["roadmap-notes", roadmapId, "infinite"],
      (params) => {
        if (!roadmapId) return [];
        return roadmapNoteService.getNotes({ roadmap: roadmapId, ...params, page_size: 10 });
      },
      [roadmapId]
    );

  const createNote = useMutation({
    mutationFn: roadmapNoteService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes", roadmapId, "infinite"]);
      queryClient.invalidateQueries(["roadmaps"]);
    },
  });

  const updateNote = useMutation({
    mutationFn: ({ id, data }) => roadmapNoteService.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-notes", roadmapId, "infinite"]);
    },
  });

  const deleteNote = useMutation({
    mutationFn: roadmapNoteService.deleteNote,
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
