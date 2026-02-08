import { useState } from 'react';
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Calendar, 
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const RoadmapCard = ({ roadmap, onDelete, onClick, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);

  const typeColors = {
    daily: 'bg-blue-100 text-blue-800 border-blue-300',
    weekly: 'bg-purple-100 text-purple-800 border-purple-300',
    monthly: 'bg-green-100 text-green-800 border-green-300',
  };

  const statusColors = {
    active: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    paused: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProgressColor = () => {
    const progress = roadmap.progress_percentage || 0;
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-bold text-gray-900 text-lg">{roadmap.title}</h3>
            {roadmap.is_delayed && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            {roadmap.is_ahead && (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </div>
          {roadmap.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{roadmap.description}</p>
          )}
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
                    onEdit?.(roadmap);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this roadmap?')) {
                      onDelete(roadmap.id);
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

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-semibold text-gray-900">
            {roadmap.progress_percentage || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${roadmap.progress_percentage || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(roadmap.start_date)} - {formatDate(roadmap.end_date)}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{roadmap.actual_hours || 0} / {roadmap.target_hours || 0} hrs</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Target className="h-4 w-4" />
          <span>{roadmap.completed_milestones || 0} / {roadmap.milestones_count || 0} milestones</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CheckCircle2 className="h-4 w-4" />
          <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[roadmap.status]}`}>
            {roadmap.status?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className={`px-2 py-1 rounded text-xs font-medium border ${typeColors[roadmap.type]}`}>
          {roadmap.type?.toUpperCase()}
        </span>
        {roadmap.category && (
          <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
            {roadmap.category.replace('_', ' ').toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};
