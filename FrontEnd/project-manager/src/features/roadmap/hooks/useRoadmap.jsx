import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useInfiniteList from '../../../shared/hooks/useInfiniteList';
import { roadmapService } from "../services/roadmapService";
import { useState } from "react";

export function useRoadmap() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    type: null,
    status: null,
    category: null,
    search: '',
    startDate: null,
    endDate: null,
  });

  const roadmaps = useQuery({
    queryKey: ["roadmaps", filters],
    queryFn: () => roadmapService.getRoadmaps(filters),
  });

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

  const getInfiniteRoadmaps = (overrideFilters = null) => {
    const combined = { ...filters, ...(overrideFilters || {}) };
    return useInfiniteList(
      ["roadmaps", "infinite"],
      (params) => roadmapService.getRoadmaps({ ...combined, ...params, page_size: 5 }),
      [combined]
    );
  };

  return {
    roadmaps,
    filters,
    setFilters,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
    getInfiniteRoadmaps,
  };
}
