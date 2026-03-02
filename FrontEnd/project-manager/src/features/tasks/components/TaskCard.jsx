import React, { useState } from 'react';
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Calendar, 
  User,
  Flag,
  CheckCircle2,
  Circle,
  Clock
} from 'lucide-react';

export const TaskCard = ({ task, onUpdate, onDelete, onClick }) => {
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800 border-gray-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusIcons = {
    pending: Circle,
    in_progress: Clock,
    completed: CheckCircle2,
  };

  const statusColors = {
    pending: 'text-gray-400',
    in_progress: 'text-yellow-500',
    completed: 'text-green-500',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = () => {
    if (!task.deadline || task.status === 'completed') return false;
    return new Date(task.deadline) < new Date();
  };

  const StatusIcon = statusIcons[task.status];

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${
        isOverdue() ? 'border-red-500' : 'border-transparent'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
              onUpdate({ id: task.id, data: { status: nextStatus } });
            }}
            className="mt-0.5"
          >
            <StatusIcon className={`h-5 w-5 ${statusColors[task.status]}`} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 ${
              task.status === 'completed' ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="relative ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this task?')) {
                      await onDelete.mutateAsync(task.id);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {task.priority && (
          <span className={`px-2 py-1 rounded text-xs font-medium border ${priorityColors[task.priority]}`}>
            <Flag className="h-3 w-3 inline mr-1" />
            {task.priority}
          </span>
        )}

        {task.deadline && (
          <span className={`px-2 py-1 rounded text-xs ${
            isOverdue() ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
          }`}>
            <Calendar className="h-3 w-3 inline mr-1" />
            {formatDate(task.deadline)}
          </span>
        )}

        {task.assigned_to && (
          <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
            <User className="h-3 w-3 inline mr-1" />
            {task.assigned_to.email?.split('@')[0] || 'Assigned'}
          </span>
        )}
      </div>
    </div>
  );
};