import { Card } from "@/shared/components/Card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const InsightsCard = ({ summaryData }) => {
  return (
    <Card title="Insights">
      <div className="space-y-2">
        {Number(summaryData?.balance || 0) > Number(summaryData?.income || 0) * 0.2 && (
          <div className="flex items-start space-x-2 text-sm">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-gray-700">Savings are healthy for this period.</p>
          </div>
        )}

        {Number(summaryData?.expense_ratio || 0) > 80 && (
          <div className="flex items-start space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-gray-700">
              Expense ratio is high. Review variable spending categories.
            </p>
          </div>
        )}

        {Number(summaryData?.balance || 0) < 0 && (
          <div className="flex items-start space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-gray-700">
              Net balance is negative. Reduce discretionary expenses.
            </p>
          </div>
        )}

        {Number(summaryData?.savings_ratio || 0) > 20 && (
          <div className="flex items-start space-x-2 text-sm">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-gray-700">
              Strong savings rate: {summaryData?.savings_ratio}%.
            </p>
          </div>
        )}

        {Number(summaryData?.income || 0) === 0 &&
          Number(summaryData?.expenses || 0) === 0 && (
            <div className="flex items-start space-x-2 text-sm">
              <AlertCircle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-gray-500">
                No transactions recorded for this filter set.
              </p>
            </div>
          )}
      </div>
    </Card>
  );
};
