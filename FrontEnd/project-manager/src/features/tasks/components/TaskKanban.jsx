import { TaskCard } from './TaskCard';
import { Spinner } from '../../../shared/components/Spinner';
import ErrorState from '../../../shared/components/Error/ErrorState';

export const TaskKanban = ({ onTaskClick, getTasksByStatus, filters, updateTask: onUpdate, deleteTask: onDelete }) => {

  const columns = [
    { id: 'pending', title: 'To Do', color: 'gray' },
    { id: 'in_progress', title: 'In Progress', color: 'blue' },
    { id: 'completed', title: 'Completed', color: 'green' },
  ];

  const colorClasses = {
    gray: 'border-gray-300',
    blue: 'border-blue-300',
    green: 'border-green-300',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id, filters);
        const {data, isLoading, error, refetch} = columnTasks || {};
        return (
            <div key={column.id} className="flex flex-col">
              <div className={`bg-white rounded-lg shadow-md p-4 border-t-4 ${colorClasses[column.color]} mb-4`}>
                <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                  <span>{column.title}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {data?.length}
                  </span>
                </h3>
              </div>
              <div className="space-y-3 flex-1">
                { isLoading ? <Spinner /> :
                  error ? <div className="p-6">
                            <ErrorState message="Failed to load tasks." onRetry={refetch} />
                          </div> :
                  data?.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm">
                      No tasks
                    </div>
                  ) : (
                  data.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onClick={() => onTaskClick(task)}
                    />
                  ))
                )}
              </div>
            </div>
        );
      })}
    </div>
  );
};