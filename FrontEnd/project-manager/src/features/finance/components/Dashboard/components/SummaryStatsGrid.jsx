import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "@/shared/utils/formatCurrency";

const colorClasses = {
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  blue: "bg-blue-50 text-blue-600",
};

export const SummaryStatsGrid = ({
  summaryData,
  totalIncomeFromSeries,
  totalExpenseFromSeries,
}) => {
  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(summaryData?.income || totalIncomeFromSeries),
      icon: TrendingUp,
      color: "green",
      trend: summaryData?.income_trend,
    },
    {
      title: "Total Expenses",
      value: formatCurrency(summaryData?.expenses || totalExpenseFromSeries),
      icon: TrendingDown,
      color: "red",
      trend: summaryData?.expenses_trend,
    },
    {
      title: "Net Balance",
      value: formatCurrency(summaryData?.balance || 0),
      icon: Wallet,
      color: Number(summaryData?.balance || 0) >= 0 ? "blue" : "red",
    },
  ];

  return (
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
                    <p
                      className={`text-sm ml-1 ${
                        stat.trend.positive ? "text-green-600" : "text-red-600"
                      }`}
                    >
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
  );
};
