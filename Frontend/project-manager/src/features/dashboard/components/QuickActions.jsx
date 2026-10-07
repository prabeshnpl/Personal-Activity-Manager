import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Map, DollarSign, Building2 } from 'lucide-react';
import { Card } from '../../../shared/components/Card';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Go to Tasks', icon: CheckSquare, color: 'blue', action: () => navigate('/tasks') },
    { label: 'Open Roadmaps', icon: Map, color: 'indigo', action: () => navigate('/roadmaps') },
    { label: 'View Finance', icon: DollarSign, color: 'green', action: () => navigate('/finance') },
    { label: 'Organization', icon: Building2, color: 'slate', action: () => navigate('/organization') },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    green: 'bg-emerald-100 text-emerald-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.action}
              className="flex items-center space-x-3 rounded-lg cursor-pointer border border-gray-200 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
            >
              <div className={`rounded-lg p-2 ${colorClasses[action.color]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-gray-700">{action.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
