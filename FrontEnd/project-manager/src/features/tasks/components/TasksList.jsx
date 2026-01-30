import { useState } from 'react';
import { Spinner } from '../../../shared/components/Spinner';
import { EmptyState } from '../../../shared/components/EmptyState';
import ErrorState from '../../../shared/components/Error/ErrorState';
import { TaskCard } from './TaskCard';
import { AddTaskModal } from './AddTaskModal';
import { TaskDetailModal } from './TaskDetailModal';
import { CheckSquare } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';

export const TasksList = () => {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const {data, isLoading, error, refetch} = tasks;
  
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