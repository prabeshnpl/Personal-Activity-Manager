import { Card } from '../../../../shared/components/Card';
import { TrendingUp, TrendingDown, CheckCircle2, Clock, Target } from 'lucide-react';
import { formatDate } from '../../../../shared/utils/formatDate';

export const ProgressTracker = ({ progress, roadmap }) => {
  if (!progress || !roadmap) return null;

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'ahead':
        return <TrendingUp className="h-6 w-6 text-green-600" />;
      case 'delayed':
        return <TrendingDown className="h-6 w-6 text-red-600" />;
      default:
        return <CheckCircle2 className="h-6 w-6 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'ahead':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'delayed':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'ahead':
        return 'Ahead of Schedule';
      case 'delayed':
        return 'Behind Schedule';
      default:
        return 'On Track';
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Status Banner */}
        <div className={`p-4 rounded-lg border-2 flex items-center space-x-3 ${getStatusColor()}`}>
          {getStatusIcon()}
          <div>
            <p className="font-semibold">{getStatusText()}</p>
            <p className="text-sm">
              Estimated completion: {formatDate(progress.estimated_completion_date)}
            </p>
          </div>
        </div>

        {/* Progress Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{progress.progress_percentage}%</p>
            <p className="text-xs text-gray-600">Complete</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {progress.milestones_completed}/{progress.milestones_total}
            </p>
            <p className="text-xs text-gray-600">Milestones</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {progress.hours_logged}/{progress.target_hours}
            </p>
            <p className="text-xs text-gray-600">Hours</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{progress.velocity?.toFixed(1) || 0}</p>
            <p className="text-xs text-gray-600">Velocity</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Days Elapsed: {progress.days_elapsed}</span>
            <span>Days Remaining: {progress.days_remaining}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ 
                width: `${progress.days_elapsed > 0 
                  ? (progress.days_elapsed / (progress.days_elapsed + progress.days_remaining)) * 100 
                  : 0}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
};
