import { useEffect, useRef, useState } from 'react';
import { Card } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { AddMilestoneModal } from './AddMilestoneModal';
import { Plus, CheckCircle2, Circle, Calendar, Clock, Trash2 } from 'lucide-react';
import { Spinner } from '../../../../shared/components/Spinner';
import ErrorState from '../../../../shared/components/Error/ErrorState';

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

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (milestone) => {
    if (!milestone.target_date || milestone.is_completed) return false;
    return new Date(milestone.target_date) < new Date();
  };

  return (
    <>
      <Card
        title={`Milestones (${milestones.length})`}
        action={
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
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
              <div
                key={milestone.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  milestone.is_completed
                    ? 'bg-green-50 border-green-200'
                    : isOverdue(milestone)
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => onToggle({ milestoneId: milestone.id, isCompleted: milestone.is_completed })}
                    className="mt-1 shrink-0"
                  >
                    {milestone.is_completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 hover:text-blue-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold text-gray-900 ${
                        milestone.is_completed ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {milestone.title}
                    </h4>
                    {milestone.description && (
                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span className={isOverdue(milestone) ? 'text-red-600 font-medium' : ''}>
                          {formatDate(milestone.target_date)}
                        </span>
                      </div>

                      {milestone.estimated_hours && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {milestone.actual_hours || 0} / {milestone.estimated_hours} hrs
                          </span>
                        </div>
                      )}

                      {milestone.is_completed && milestone.completed_at && (
                        <span className="text-green-600 text-xs">
                          Completed on {formatDate(milestone.completed_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDelete({ milestoneId: milestone.id })}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
