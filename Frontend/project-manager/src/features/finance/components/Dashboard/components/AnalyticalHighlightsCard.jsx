import { Card } from "@/shared/components/Card";
import { formatCurrency } from "@/shared/utils/formatCurrency";

export const AnalyticalHighlightsCard = ({
  avgIncomePerBucket,
  avgExpensePerBucket,
  summaryData,
}) => {
  return (
    <Card title="Analytical Highlights">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Avg Income / Bucket</p>
          <p className="text-lg font-semibold text-green-600">
            {formatCurrency(avgIncomePerBucket)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Avg Expense / Bucket</p>
          <p className="text-lg font-semibold text-red-600">
            {formatCurrency(avgExpensePerBucket)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Savings Ratio</p>
          <p className="text-lg font-semibold text-blue-600">
            {summaryData?.savings_ratio ?? 0}%
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Expense Ratio</p>
          <p className="text-lg font-semibold text-orange-600">
            {summaryData?.expense_ratio ?? 0}%
          </p>
        </div>
      </div>
    </Card>
  );
};
