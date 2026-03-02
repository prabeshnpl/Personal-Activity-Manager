import React from 'react';
import { Card } from '../../../../shared/components/Card';
import { BarChart3 } from 'lucide-react';

export const MonthlyComparison = ({ data, isLoading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "NPR",
      notation: 'compact',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card title="Monthly Comparison">
        <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
      </Card>
    );
  }

  if (!data.months || data.months.length === 0) {
    return (
      <Card title="Monthly Comparison">
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No monthly data available</p>
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.income, ...data.expenses);

  return (
    <Card title="Monthly Comparison">
      {/* Chart */}
      <div className="space-y-6 mb-6">
        {data.months.map((month, index) => (
          <div key={month}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 w-12">{month}</span>
              <div className="flex-1 mx-4">
                <div className="flex items-center space-x-2">
                  {/* Income Bar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-green-600">Income</span>
                      <span className="text-xs font-semibold text-green-600">
                        {formatCurrency(data.income[index])}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(data.income[index] / maxValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Expense Bar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-red-600">Expense</span>
                      <span className="text-xs font-semibold text-red-600">
                        {formatCurrency(data.expenses[index])}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(data.expenses[index] / maxValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-20 text-right">
                <span className={`text-sm font-semibold ${data.net[index] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(data.net[index])}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      {data.comparison && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Insights</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-gray-600 mb-1">Best Month</p>
              <p className="font-semibold text-green-700">{data.comparison.best_month}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-gray-600 mb-1">Highest Expense</p>
              <p className="font-semibold text-red-700">{data.comparison.worst_month}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};