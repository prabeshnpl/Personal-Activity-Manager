import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "../../finance/services/financeService";
import { roadmapService } from "../../roadmap/services/roadmapService";
import { taskService } from "../../tasks/services/taskService";

const toList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getTotal = (payload) => {
  if (!payload) return 0;
  if (typeof payload.total_count === "number") return payload.total_count;
  if (typeof payload.count === "number") return payload.count;
  if (typeof payload.total === "number") return payload.total;
  return toList(payload).length;
};

const parseNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const getRoadmapStats = (stats) => {
  const total = parseNumber(stats?.total ?? stats?.total_roadmaps);
  const completed = parseNumber(stats?.completed ?? stats?.completed_roadmaps);
  const active = parseNumber(stats?.active ?? stats?.active_roadmaps);

  return {
    total,
    completed,
    active,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};

const normalizeActivity = ({ taskList, roadmapList, transactions }) => {
  const taskItems = taskList.map((task) => ({
    id: `task-${task.id}`,
    type: "task",
    title: task.title || "Untitled task",
    subtitle: task.status ? `Status: ${task.status.replace("_", " ")}` : "Task update",
    date: task.updated_at || task.created_at || null,
  }));

  const roadmapItems = roadmapList.map((roadmap) => ({
    id: `roadmap-${roadmap.id}`,
    type: "roadmap",
    title: roadmap.title || "Untitled roadmap",
    subtitle: roadmap.status
      ? `Roadmap ${roadmap.status.replace("_", " ")}`
      : "Roadmap update",
    date: roadmap.updated_at || roadmap.created_at || null,
  }));

  const transactionItems = transactions.map((item) => ({
    id: `transaction-${item.id}`,
    type: "transaction",
    title: item.description || "Transaction",
    subtitle: item.transaction_type
      ? `${item.transaction_type} transaction`
      : "Finance update",
    date: item.occurred_at || item.updated_at || item.created_at || null,
  }));

  return [...taskItems, ...roadmapItems, ...transactionItems]
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 8);
};

export function useDashboard() {
  const taskCountsQuery = useQuery({
    queryKey: ["dashboard", "tasks", "counts"],
    queryFn: async () => {
      const [all, completed, inProgress, pending] = await Promise.all([
        taskService.getTasks({ page: 1, page_size: 1 }),
        taskService.getTasks({ page: 1, page_size: 1, status: "completed" }),
        taskService.getTasks({ page: 1, page_size: 1, status: "in_progress" }),
        taskService.getTasks({ page: 1, page_size: 1, status: "pending" }),
      ]);
      return { all, completed, inProgress, pending };
    },
    retry: false,
  });

  const recentTasksQuery = useQuery({
    queryKey: ["dashboard", "tasks", "recent"],
    queryFn: () => taskService.getTasks({ page: 1, page_size: 8, ordering: "-created_at" }),
    retry: false,
  });

  const roadmapStatsQuery = useQuery({
    queryKey: ["dashboard", "roadmaps", "stats"],
    queryFn: () => roadmapService.getRoadmapStats(),
    retry: false,
  });

  const recentRoadmapsQuery = useQuery({
    queryKey: ["dashboard", "roadmaps", "recent"],
    queryFn: () =>
      roadmapService.getRoadmaps({ page: 1, page_size: 5, ordering: "-updated_at" }),
    retry: false,
  });

  const financeSummaryQuery = useQuery({
    queryKey: ["dashboard", "finance", "summary"],
    queryFn: () => financeService.getSummary({ period: "monthly" }),
    retry: false,
  });

  const recentTransactionsQuery = useQuery({
    queryKey: ["dashboard", "finance", "recent-transactions"],
    queryFn: () =>
      financeService.getTransactions({ page: 1, page_size: 6, ordering: "-occurred_at" }),
    retry: false,
  });

  const metrics = useMemo(() => {
    const allTasksCount = getTotal(taskCountsQuery.data?.all);
    const completedTasksCount = getTotal(taskCountsQuery.data?.completed);
    const inProgressTasksCount = getTotal(taskCountsQuery.data?.inProgress);
    const pendingTasksCount = getTotal(taskCountsQuery.data?.pending);
    const activeTasksCount = Math.max(allTasksCount - completedTasksCount, 0);
    const taskCompletionRate =
      allTasksCount > 0 ? Math.round((completedTasksCount / allTasksCount) * 100) : 0;

    const roadmapStats = getRoadmapStats(roadmapStatsQuery.data);
    const financeSummary = financeSummaryQuery.data || {};

    const monthlyIncome = parseNumber(
      financeSummary.income ?? financeSummary.total_income
    );
    const monthlyExpense = parseNumber(
      financeSummary.expenses ?? financeSummary.total_expense
    );
    const balance = parseNumber(
      financeSummary.balance ?? financeSummary.net_balance
    );

    const recentTasks = toList(recentTasksQuery.data);
    const recentRoadmaps = toList(recentRoadmapsQuery.data);
    const recentTransactions = toList(recentTransactionsQuery.data);

    return {
      cards: {
        activeTasks: activeTasksCount,
        roadmaps: roadmapStats.total,
        monthlyBalance: balance,
        taskCompletionRate,
      },
      tasks: {
        total: allTasksCount,
        completed: completedTasksCount,
        inProgress: inProgressTasksCount,
        pending: pendingTasksCount,
        completionRate: taskCompletionRate,
      },
      roadmaps: roadmapStats,
      finance: {
        income: monthlyIncome,
        expense: monthlyExpense,
        balance,
      },
      recentTasks: recentTasks.slice(0, 5),
      recentRoadmaps: recentRoadmaps.slice(0, 5),
      recentTransactions: recentTransactions.slice(0, 5),
      recentActivity: normalizeActivity({
        taskList: recentTasks,
        roadmapList: recentRoadmaps,
        transactions: recentTransactions,
      }),
    };
  }, [
    taskCountsQuery.data,
    roadmapStatsQuery.data,
    financeSummaryQuery.data,
    recentTasksQuery.data,
    recentRoadmapsQuery.data,
    recentTransactionsQuery.data,
  ]);

  return {
    metrics,
    sectionStatus: {
      tasks: {
        isLoading: taskCountsQuery.isLoading,
        error: taskCountsQuery.error,
        refetch: taskCountsQuery.refetch,
      },
      roadmaps: {
        isLoading: roadmapStatsQuery.isLoading,
        error: roadmapStatsQuery.error,
        refetch: roadmapStatsQuery.refetch,
      },
      finance: {
        isLoading: financeSummaryQuery.isLoading,
        error: financeSummaryQuery.error,
        refetch: financeSummaryQuery.refetch,
      },
      activity: {
        isLoading:
          recentTasksQuery.isLoading ||
          recentRoadmapsQuery.isLoading ||
          recentTransactionsQuery.isLoading,
        error:
          recentTasksQuery.error ||
          recentRoadmapsQuery.error ||
          recentTransactionsQuery.error,
        refetch: () => {
          recentTasksQuery.refetch();
          recentRoadmapsQuery.refetch();
          recentTransactionsQuery.refetch();
        },
      },
      health: {
        isLoading:
          taskCountsQuery.isLoading ||
          roadmapStatsQuery.isLoading ||
          financeSummaryQuery.isLoading,
        error: taskCountsQuery.error || roadmapStatsQuery.error || financeSummaryQuery.error,
        refetch: () => {
          taskCountsQuery.refetch();
          roadmapStatsQuery.refetch();
          financeSummaryQuery.refetch();
        },
      },
    },
  };
}
