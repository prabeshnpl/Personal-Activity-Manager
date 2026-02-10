import { X, Calendar, CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { Button } from '../../../../shared/components/Button';
import { MarkdownContent } from '../../../../shared/components/MarkdownContent';
import { formatDate } from '../../../../shared/utils/formatDate';

export const MilestoneDetailModal = ({ milestone, onClose, onDelete, onToggle }) => {
  if (!milestone) return null;

  const isOverdue = (milestone) => {
    if (!milestone.due_date || milestone.is_completed) return false;
    return new Date(milestone.due_date) < new Date();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{milestone.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span className={isOverdue(milestone) ? 'text-red-600 font-medium' : ''}>
                  {formatDate(milestone.due_date)}
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
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {milestone.description ? (
            <MarkdownContent content={milestone.description} className="text-sm" />
          ) : (
            <p className="text-sm text-gray-500">No description provided.</p>
          )}
        </div>

        <div className="p-6 pt-0 flex flex-col-reverse sm:flex-row gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onToggle?.({ milestoneId: milestone.id, isCompleted: milestone.is_completed });
            }}
            className="flex-1"
          >
            {milestone.is_completed ? (
              <>
                <Circle className="h-4 w-4 mr-2" />
                Mark Incomplete
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Complete
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              onDelete?.({ milestoneId: milestone.id });
              onClose();
            }}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Milestone
          </Button>
        </div>
      </div>
    </div>
  );
};
