import { useMemo, useState } from 'react';
import { useRoadmap } from '../hooks/useRoadmap';
import { RoadmapList } from '../components/roadmap/RoadmapList';
import { RoadmapDetailModal } from '../components/roadmap/RoadmapDetailModal';

const RoadmapPage = () => {
  const {
    filters,
    setFilters,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
    useInfiniteRoadmaps,
  } = useRoadmap();
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const infiniteRoadmaps = useInfiniteRoadmaps();

  const roadmaps = useMemo(() => {
    const pages = infiniteRoadmaps?.data?.pages || [];
    return pages.flat();
  }, [infiniteRoadmaps?.data?.pages]);

  const activeRoadmap = useMemo(
    () => roadmaps.find((roadmap) => roadmap.id === selectedRoadmap) || null,
    [roadmaps, selectedRoadmap]
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">

      <RoadmapList
        infiniteRoadmaps={infiniteRoadmaps}
        filters={filters}
        setFilters={setFilters}
        onCreate={createRoadmap}
        onUpdate={updateRoadmap}
        onDelete={(id) => deleteRoadmap.mutate(id)}
        onSelect={setSelectedRoadmap}
      />

      {activeRoadmap && (
        <RoadmapDetailModal
          roadmap={activeRoadmap}
          onClose={() => setSelectedRoadmap(null)}
        />
      )}

      {infiniteRoadmaps?.isLoading && roadmaps.length === 0 && (
        <div className="text-sm text-gray-500">Loading roadmaps...</div>
      )}
    </div>
  );
};

export default RoadmapPage;
