import React from 'react';
import { Plus, CheckSquare, Map, DollarSign } from 'lucide-react';
import { Card } from '../../../shared/components/Card';

export const QuickActions = () => {
  const actions = [
    { label: 'New Task', icon: CheckSquare, color: 'blue', action: () => {} },
    { label: 'New Roadmap', icon: Map, color: 'purple', action: () => {} },
    { label: 'Add Transaction', icon: DollarSign, color: 'green', action: () => {} },
  ];

  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.action}
              className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                <Icon className={`h-5 w-5 text-${action.color}-600`} />
              </div>
              <span className="font-medium text-gray-700">{action.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};