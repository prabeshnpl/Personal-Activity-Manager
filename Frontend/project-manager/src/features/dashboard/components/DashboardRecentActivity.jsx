import { Activity, CheckSquare, DollarSign, Map } from "lucide-react";
import { Card } from "../../../shared/components/Card";
import { formatDate } from "../../../shared/utils/formatDate";
import ErrorState from "../../../shared/components/Error/ErrorState";
import { Spinner } from "../../../shared/components/Spinner";

const iconByType = {
  task: CheckSquare,
  roadmap: Map,
  transaction: DollarSign,
};

const colorByType = {
  task: "bg-blue-50 text-blue-600",
  roadmap: "bg-indigo-50 text-indigo-600",
  transaction: "bg-emerald-50 text-emerald-600",
};

export const DashboardRecentActivity = ({
  items = [],
  isLoading = false,
  error = null,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <Card title="Recent Activity">
        <Spinner />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Recent Activity">
        <ErrorState message="Failed to load recent activity." onRetry={onRetry} />
      </Card>
    );
  }

  return (
    <Card title="Recent Activity" className="pb-2 max-h-100 overflow-y-auto">
      {items.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          No activity found for this organization yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = iconByType[item.type] || Activity;
            const iconColor = colorByType[item.type] || "bg-gray-100 text-gray-600";

            return (
              <div
                key={item.id}
                className="
                  flex items-center justify-between rounded-lg 
                  border border-gray-100 px-3 py-2
                "
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="max-w-[80%]">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  {item.date ? formatDate(item.date, "Recent") : "Recent"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
