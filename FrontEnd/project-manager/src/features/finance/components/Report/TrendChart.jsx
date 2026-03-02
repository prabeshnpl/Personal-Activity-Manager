import React from 'react';
import { Card } from '../../../../shared/components/Card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export const TrendChart = ({ data, cashFlow, isLoading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card title="Trend Analysis">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Spending Trends */}
      <Card title="Spending Trends">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Daily Average</span>
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.daily_average || 0)}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Weekly Average</span>
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.weekly_average || 0)}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monthly Average</span>
              <Activity className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.monthly_average || 0)}
            </p>
          </div>

          {data.spending_pattern && (
            <div className={`p-3 rounded-lg ${
              data.spending_pattern === 'increasing' ? 'bg-red-50' : 'bg-green-50'
            }`}>
              <div className="flex items-center space-x-2">
                {data.spending_pattern === 'increasing' ? (
                  <TrendingUp className="h-5 w-5 text-red-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-green-600" />
                )}
                <span className={`text-sm font-medium ${
                  data.spending_pattern === 'increasing' ? 'text-red-700' : 'text-green-700'
                }`}>
                  Spending is {data.spending_pattern}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Cash Flow */}
      <Card title="Cash Flow Analysis">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Opening Balance</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(cashFlow.opening_balance || 0)}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Closing Balance</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(cashFlow.closing_balance || 0)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Total Inflow</p>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(cashFlow.total_inflow || 0)}
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600 mb-1">Total Outflow</p>
            <p className="text-2xl font-bold text-red-700">
              {formatCurrency(cashFlow.total_outflow || 0)}
            </p>
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            (cashFlow.net_change || 0) >= 0
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}>
            <p className="text-sm text-gray-600 mb-1">Net Change</p>
            <p className={`text-2xl font-bold ${
              (cashFlow.net_change || 0) >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {formatCurrency(cashFlow.net_change || 0)}
            </p>
          </div>

          {cashFlow.runway_months > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Financial Runway</p>
              <p className="text-lg font-bold text-blue-700">
                {cashFlow.runway_months} months
              </p>
              <p className="text-xs text-gray-500 mt-1">
                At current burn rate of {formatCurrency(cashFlow.burn_rate || 0)}/month
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};