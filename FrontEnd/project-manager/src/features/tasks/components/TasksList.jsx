import { useState, useEffect, useRef } from 'react';
import { Spinner } from '../../../shared/components/Spinner';
import { EmptyState } from '../../../shared/components/EmptyState';
import ErrorState from '../../../shared/components/Error/ErrorState';
import { TaskCard } from './TaskCard';
import { AddTaskModal } from './AddTaskModal';
import { TaskDetailModal } from './TaskDetailModal';
import { CheckSquare } from 'lucide-react';

export const TasksList = ({ infiniteTasks, createTask, updateTask, deleteTask }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { 
    data:pages, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    refetch 
  } = infiniteTasks;

  let data = pages?.pages ? pages.pages.flat() : [];

  // Infinite scroll sentinel
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
  

  // Initial / fallback loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message="Failed to load tasks." onRetry={refetch} />
      </div>
    );
  }

  return (
    <>
      {/* Tasks Grid */}
      {data?.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Create your first task to get started"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateTask={updateTask}
              deleteTask={deleteTask}
              onClick={() => setSelectedTask(task)}
            />
          ))}
        </div>
      )}

      {/* Sentinel for infinite loading */}
      {hasNextPage && (
        <div className="flex items-center justify-center mt-6">
          <div ref={sentinelRef} className="h-6"></div>
          {isFetchingNextPage && <Spinner />}
          {!hasNextPage && (
            <div className="text-sm text-gray-500 mt-2">No more tasks</div>
          )}
        </div>
      )}

      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          createTask={createTask}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      )}
    </>
  );
};
