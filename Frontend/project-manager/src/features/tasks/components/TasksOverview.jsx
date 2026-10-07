import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle,
  ListTodo 
} from 'lucide-react';

export const TasksOverview = ({ stats, isLoading }) => {
  const statsData = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: ListTodo,
      color: 'blue',
    },
    {
      title: 'In Progress',
      value: stats?.in_progress || 0,
      icon: PlayCircle,
      color: 'yellow',
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircle2,
      color: 'green',
    },
    {
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: AlertCircle,
      color: 'red',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
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
  );
};