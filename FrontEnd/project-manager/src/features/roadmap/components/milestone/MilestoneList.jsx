import { useEffect, useRef, useState } from 'react';
import { Card } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { AddMilestoneModal } from './AddMilestoneModal';
import { Plus, CheckCircle2} from 'lucide-react';
import { Spinner } from '../../../../shared/components/Spinner';
import ErrorState from '../../../../shared/components/Error/ErrorState';
import { MilestoneCard } from './MilestoneCard';

export const MilestonesList = ({
  infiniteMilestones,
  roadmapId,
  onCreate,
  onUpdate,
  onDelete,
  onToggle,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const {
    data: pages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = infiniteMilestones;

  const milestones = pages?.pages ? pages.pages.flat() : [];
  const totalCount = Number(pages?.pages?.at(-1)?.meta?.total_count ?? milestones.length ?? 0);
  const titleText = totalCount > 0 ? `Milestones (${totalCount})` : 'Milestones';

  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!fetchNextPage) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 1 });

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <Card
        title={titleText}
        action={
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        }
      >
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <ErrorState message="Failed to load milestones." onRetry={refetch} />
          ) : milestones.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No milestones yet"
              description="Break down your roadmap into milestones"
            />
          ) : (
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <MilestoneCard 
                  key={milestone.id} 
                  milestone={milestone} 
                  onUpdate={onUpdate} 
                  onDelete={onDelete} 
                  onToggle={onToggle} 
                />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="flex items-center justify-center mt-6">
              <div ref={sentinelRef} className="h-6"></div>
              {isFetchingNextPage && <Spinner />}
              {!hasNextPage && (
                <div className="text-sm text-gray-500 mt-2">No more milestones</div>
              )}
            </div>
          )}
        </div>
      </Card>

      {showAddModal && (
        <AddMilestoneModal
          roadmapId={roadmapId}
          onClose={() => setShowAddModal(false)}
          onCreate={onCreate}
        />
      )}
    </>
  );
};
