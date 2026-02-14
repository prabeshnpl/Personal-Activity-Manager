import { Card } from "@/shared/components/Card";
import { Spinner } from "@/shared/components/Spinner";
import ErrorState from "@/shared/components/Error/ErrorState";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCompactCurrency, periodLabelMap } from "../utils";
import { formatCurrency } from "@/shared/utils/formatCurrency";

export const TrendChartCard = ({
  period,
  categoryId,
  accountId,
  trendLoading,
  trendError,
  refetchTrend,
  chartData,
}) => {
  return (
    <Card title="Income vs Expense Trend">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-600">
            {periodLabelMap[period]} trend
            {categoryId !== "all" ? " by selected category" : ""}
            {accountId !== "all" ? " and account" : ""}
          </p>
          {trendLoading && <Spinner size="sm" />}
        </div>

        {trendError ? (
          <ErrorState
            message="Failed to load income/expense trend."
            onRetry={refetchTrend}
          />
        ) : chartData.length === 0 ? (
          <div className="text-sm text-gray-500 py-8 text-center">
            No trend data available for the selected filters.
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={formatCompactCurrency}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => [formatCurrency(value), name]}
                  labelStyle={{ color: "#111827" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#16a34a"
                  fill="url(#incomeGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#dc2626"
                  fill="url(#expenseGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};
