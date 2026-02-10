import { Button } from '../../../shared/components/Button';
import { 
  X, 
  Calendar, 
  Flag, 
  User, 
  Clock,
  CheckCircle2,
  Edit2,
  Trash2 
} from 'lucide-react';

export const TaskDetailModal = (props) => {
  
  const { task, onClose, updateTask, deleteTask } = props;
  
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleStatusChange = async (newStatus) => {
    await updateTask.mutateAsync({ id: task.id, data: { status: newStatus } });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title and Status */}
            <div>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 flex-1">{task.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                        {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
                {task.description && (
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                )}
            </div>
        {/* Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Deadline</p>
            <p className="font-medium text-gray-900">{formatDate(task.deadline)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Flag className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Priority</p>
            <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${priorityColors[task.priority]}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {task.assigned_to && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assigned To</p>
              <p className="font-medium text-gray-900">{task.assigned_to.email}</p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="font-medium text-gray-900">{formatDate(task.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {task.status !== 'in_progress' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {handleStatusChange('in_progress'); onClose();}}
            >
              Mark In Progress
            </Button>
          )}
          {task.status !== 'completed' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {handleStatusChange('completed'); onClose();}}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          )}
          {task.status === 'completed' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {handleStatusChange('pending'); onClose();}}
            >
              Reopen Task
            </Button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="danger"
          onClick={handleDelete}
          className="flex-1"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Task
        </Button>
        <Button
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Task
        </Button>
      </div>
    </div>
  </div>
</div>
);
};
