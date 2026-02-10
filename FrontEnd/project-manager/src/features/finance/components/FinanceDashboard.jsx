import { Card } from '../../../shared/components/Card';
import { useFinance } from '../hooks/useFinanceDashboard';
import { Spinner } from '../../../shared/components/Spinner';
import ErrorState from '../../../shared/components/Error/ErrorState';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertCircle
} from 'lucide-react';

export const FinanceDashboard = () => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  const { summary, setPeriod, period, categoryBreakdown, recentTransactions } = useFinance();
  const { data: summaryData, isLoading: summaryLoading, error: summaryError, refetch } = summary;

  const stats = [
    {
      title: 'Total Income',
      value: formatCurrency(summaryData?.income || 0),
      icon: TrendingUp,
      color: 'green',
      trend: summaryData?.income_trend,
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summaryData?.expenses || 0),
      icon: TrendingDown,
      color: 'red',
      trend: summaryData?.expenses_trend,
    },
    {
      title: 'Balance',
      value: formatCurrency(summaryData?.balance || 0),
      icon: Wallet,
      color: summaryData?.balance >= 0 ? 'blue' : 'red',
    },
  ];

  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (summaryError) {
    return <ErrorState message="Failed to load Dashboard data." onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 mt-5">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="daily">Today</option>
          <option value="monthly">This Month</option>
          <option value="yearly">This Year</option>
        </select>
      </div>

      <div className="max-h-120 space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                    {stat.trend && (
                      <div className="flex items-center mt-2">
                        {stat.trend.positive ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <p className={`text-sm ml-1 ${stat.trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.trend.value}
                        </p>
                        <span className="text-xs text-gray-500 ml-2">vs last period</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Health Indicators */}
        <Card title="Financial Health">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income vs Expenses Chart */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Income vs Expenses</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Income</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(summaryData?.income || 0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{
                        width: `${
                          summaryData?.income + summaryData?.expenses > 0
                            ? (summaryData.income / (summaryData.income + summaryData.expenses)) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Expenses</span>
                    <span className="text-sm font-medium text-red-600">
                      {formatCurrency(summaryData?.expenses || 0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-600 h-3 rounded-full"
                      style={{
                        width: `${
                          summaryData?.income + summaryData?.expenses > 0
                            ? (summaryData.expenses / (summaryData.income + summaryData.expenses)) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Insights */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Insights</h4>
              <div className="space-y-2">
                {summaryData?.balance > summaryData?.income * 0.2 && (
                  <div className="flex items-start space-x-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <p className="text-gray-700">Great job! You're saving well this {period}.</p>
                  </div>
                )}
                
                {summaryData?.expense_ratio > 80 && (
                  <div className="flex items-start space-x-2 text-sm">
                    <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">Your expenses are high. Consider reviewing your spending.</p>
                  </div>
                )}

                {summaryData?.balance < 0 && (
                  <div className="flex items-start space-x-2 text-sm">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-gray-700">You're in deficit. Time to cut back on expenses.</p>
                  </div>
                )}

                {summaryData?.savings_ratio > 20 && (
                  <div className="flex items-start space-x-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <p className="text-gray-700">Excellent savings rate of {summaryData?.savings_ratio}%!</p>
                  </div>
                )}

                {summaryData?.income === 0 && summaryData?.expenses === 0 && (
                  <div className="flex items-start space-x-2 text-sm">
                    <AlertCircle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-gray-500">No transactions recorded for this period.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
