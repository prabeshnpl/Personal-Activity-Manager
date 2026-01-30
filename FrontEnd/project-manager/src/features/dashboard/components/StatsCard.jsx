import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {trend && (
                <p className={`text-sm mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.value}
                </p>
                )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                <Icon className="h-8 w-8" />
            </div>
        </div>
    </div>
);
}