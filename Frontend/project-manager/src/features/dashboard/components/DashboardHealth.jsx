import { Card } from "../../../shared/components/Card";
import ErrorState from "../../../shared/components/Error/ErrorState";
import { Spinner } from "../../../shared/components/Spinner";

const ProgressRow = ({ label, value, max = 100, color = "bg-blue-500" }) => {
  const safeMax = max > 0 ? max : 1;
  const width = Math.min(Math.round((value / safeMax) * 100), 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-md text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export const DashboardHealth = ({
  tasks,
  roadmaps,
  finance,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <Card title="Workspace Health">
        <Spinner />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Workspace Health">
        <ErrorState message="Failed to load health metrics." onRetry={onRetry} />
      </Card>
    );
  }

  const totalTaskBuckets = tasks.completed + tasks.inProgress + tasks.pending;

  return (
    <Card title="Workspace Health">
      <div className="flex flex-col space-y-5 justify-center gap-3">
        <ProgressRow
          label="Task completion"
          value={tasks.completionRate}
          max={100}
          color="bg-emerald-500"
        />
        <ProgressRow
          label="Completed tasks"
          value={tasks.completed}
          max={Math.max(totalTaskBuckets, 1)}
          color="bg-blue-500"
        />
        <ProgressRow
          label="Roadmaps completed"
          value={roadmaps.completed}
          max={Math.max(roadmaps.total, 1)}
          color="bg-indigo-500"
        />

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">This month</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Income</p>
              <p className="text-sm font-semibold text-emerald-600">
                {Number(finance.income).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Expense</p>
              <p className="text-sm font-semibold text-rose-600">
                {Number(finance.expense).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
