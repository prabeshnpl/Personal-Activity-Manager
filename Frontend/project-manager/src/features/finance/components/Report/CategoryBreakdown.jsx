import React from 'react';
import { Card } from '../../../../shared/components/Card';
import { PieChart } from 'lucide-react';

export const CategoryBreakdown = ({ data, isLoading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  const getColorClass = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <Card title="Category Breakdown">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card title="Category Breakdown">
        <div className="text-center py-12 text-gray-500">
          <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No data available for the selected filters</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Category Breakdown" className="max-h-[32rem] overflow-hidden">
      <div className="space-y-4 overflow-y-auto max-h-[24rem] pr-2">
        {data.map((category, index) => (
          <div key={category.category_id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${getColorClass(index)}`}></div>
                <span className="font-medium text-gray-900">{category.category_name}</span>
                <span className="text-xs text-gray-500">({category.transaction_count})</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(category.total_amount)}
                </p>
                <p className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getColorClass(index)}`}
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
