import { Card } from '../../../../shared/components/Card';
import { 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Clock
} from 'lucide-react';

export const RoadmapOverview = ({ stats, isLoading }) => {
  const statsData = [
    {
      title: 'Total Roadmaps',
      value: stats?.total_roadmaps || 0,
      icon: Target,
      color: 'blue',
    },
    {
      title: 'Active',
      value: stats?.active_roadmaps || 0,
      icon: TrendingUp,
      color: 'yellow',
    },
    {
      title: 'Completed',
      value: stats?.completed_roadmaps || 0,
      icon: CheckCircle2,
      color: 'green',
    },
    {
      title: 'Hours Logged',
      value: stats?.total_hours_logged || 0,
      icon: Clock,
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${colorClasses[stat.color]}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Rate */}
      {stats && stats.total_roadmaps > 0 && (
        <Card title="Overall Progress">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.completed_milestones || 0} of {stats.total_milestones || 0} milestones completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">
                  {stats.completion_rate || 0}%
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-linear-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all"
                style={{ width: `${stats.completion_rate || 0}%` }}
              ></div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};