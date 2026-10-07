import React from 'react';
import { Card } from '../../../../shared/components/Card';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Calendar,
  CreditCard
} from 'lucide-react';

export const ReportSummary = ({ summary, filters }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  const stats = [
    {
      title: 'Total Amount',
      value: formatCurrency(summary.total_amount || 0),
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'Transaction Count',
      value: summary.transaction_count || 0,
      icon: CreditCard,
      color: 'purple',
    },
    {
      title: 'Average Transaction',
      value: formatCurrency(summary.average_transaction || 0),
      icon: Activity,
      color: 'green',
    },
    {
      title: 'Period',
      value: `${Math.ceil((new Date(filters.endDate) - new Date(filters.startDate)) / (1000 * 60 * 60 * 24))} days`,
      icon: Calendar,
      color: 'yellow',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};