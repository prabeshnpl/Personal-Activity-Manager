import React from 'react';

export const StatsCard = ({ title, value, icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    yellow: 'bg-amber-50 text-amber-600',
    red: 'bg-rose-50 text-rose-600',
    purple: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="mb-1 text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {trend && (
                <p className={`mt-2 text-sm ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend.value}
                </p>
                )}
            </div>
            <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
                {icon ? React.createElement(icon, { className: "h-8 w-8" }) : null}
            </div>
        </div>
    </div>
);
}
