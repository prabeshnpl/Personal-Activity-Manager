import { useEffect, useMemo, useState } from 'react';
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
    getInfiniteRoadmaps,
  } = useRoadmap();
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const infiniteRoadmaps = getInfiniteRoadmaps();

  const roadmaps = useMemo(() => {
    const pages = infiniteRoadmaps?.data?.pages || [];
    return pages.flat();
  }, [infiniteRoadmaps?.data?.pages]);

  const activeRoadmap = useMemo(
    () => roadmaps.find((roadmap) => roadmap.id === selectedRoadmap) || null,
    [roadmaps, selectedRoadmap]
  );

  useEffect(() => {
    if (selectedRoadmap && !activeRoadmap) {
      setSelectedRoadmap(null);
    }
  }, [selectedRoadmap, activeRoadmap, setSelectedRoadmap]);

  return (
    <div className="p-4 sm:p-6 space-y-6">

    {/* Header */}
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Roadmaps</h1>
      <p className="text-gray-600 mt-1">
        Track your progress and document your learning journey
      </p>
    </div>

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
