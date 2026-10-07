import React from 'react';
import { Card } from '../../../../shared/components/Card';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const AccountComparison = ({ data, isLoading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card title="Account Comparison">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card title="Account Comparison">
        <div className="text-center py-12 text-gray-500">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No accounts found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Account Comparison" className="max-h-[32rem] overflow-hidden">
      <div className="space-y-4 overflow-y-auto max-h-[24rem] pr-2">
        {data.map((account) => (
          <div
            key={account.account_id}
            className="p-4 bg-linear-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{account.account_name}</h4>
                <p className="text-xs text-gray-500">{account.account_type.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(account.current_balance)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="flex items-center space-x-1 text-green-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Income</span>
                </div>
                <p className="font-semibold">{formatCurrency(account.total_income)}</p>
              </div>

              <div>
                <div className="flex items-center space-x-1 text-red-600 mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">Expense</span>
                </div>
                <p className="font-semibold">{formatCurrency(account.total_expense)}</p>
              </div>

              <div>
                <div className="flex items-center space-x-1 text-blue-600 mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Net</span>
                </div>
                <p className={`font-semibold ${account.net_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(account.net_change)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
