import { formatDate } from "@/shared/utils/formatDate";
import { MarkdownContent } from '../../../../shared/components/MarkdownContent';
import { Calendar, CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';

export const MilestoneCard = ({ milestone, onUpdate, onDelete, onToggle }) => {
    const isOverdue = (milestone) => {
        if (!milestone.due_date || milestone.is_completed) return false;
        return new Date(milestone.due_date) < new Date();
    };
    return (
        <div
            key={milestone.id}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
            milestone.is_completed
                ? 'bg-green-50 border-green-200'
                : isOverdue(milestone)
                ? 'bg-red-50 border-red-200'
                : 'bg-blue-50 border-gray-200 hover:shadow-md'
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
                <MarkdownContent content={milestone.description} className="mt-1 text-sm" />
                )}

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
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

            <button
                onClick={() => onDelete({ milestoneId: milestone.id })}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            >
                <Trash2 className="h-4 w-4" />
            </button>
            </div>
        </div>
    )
  };