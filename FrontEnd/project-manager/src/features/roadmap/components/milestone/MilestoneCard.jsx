import { formatDate } from "@/shared/utils/formatDate";
import { Calendar, CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';

export const MilestoneCard = ({ milestone, onDelete, onToggle, onOpen }) => {
  const isOverdue = (milestone) => {
    if (!milestone.due_date || milestone.is_completed) return false;
    return new Date(milestone.due_date) < new Date();
  };

  const descriptionPreview = milestone.description
    ? milestone.description.replace(/\r?\n/g, ' ').trim()
    : '';
  const previewText =
    descriptionPreview.length > 120
      ? `${descriptionPreview.slice(0, 117)}...`
      : descriptionPreview;

  return (
    <div
      key={milestone.id}
      onClick={() => onOpen?.(milestone)}
      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
        milestone.is_completed
          ? 'bg-green-50 border-green-200'
          : isOverdue(milestone)
          ? 'bg-red-50 border-red-200'
          : 'bg-blue-50 border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onToggle({ milestoneId: milestone.id, isCompleted: milestone.is_completed });
          }}
          className="mt-0.5 shrink-0"
        >
          {milestone.is_completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 hover:text-blue-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-semibold text-gray-900 ${
              milestone.is_completed ? 'line-through text-gray-500' : ''
            }`}
          >
            {milestone.title}
          </h4>
          {previewText && (
            <p className="mt-1 text-xs text-gray-600 max-h-10 overflow-hidden">
              {previewText}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className={isOverdue(milestone) ? 'text-red-600 font-medium' : ''}>
                {formatDate(milestone.due_date)}
              </span>
            </div>

            {milestone.estimated_hours && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {milestone.actual_hours || 0} / {milestone.estimated_hours} hrs
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete({ milestoneId: milestone.id });
          }}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
