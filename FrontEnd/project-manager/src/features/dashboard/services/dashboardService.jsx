import { financeService } from "../../finance/services/financeService";
import { roadmapService } from "../../roadmap/services/roadmapService";
import { taskService } from "../../tasks/services/taskService";

export const dashboardService = {
  getDashboardSnapshot: async () => {
    const [
      allTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      recentTasks,
      roadmapStats,
      recentRoadmaps,
      financeSummary,
      recentTransactions,
    ] = await Promise.all([
      taskService.getTasks({ page: 1, page_size: 1 }),
      taskService.getTasks({ page: 1, page_size: 1, status: "completed" }),
      taskService.getTasks({ page: 1, page_size: 1, status: "in_progress" }),
      taskService.getTasks({ page: 1, page_size: 1, status: "pending" }),
      taskService.getTasks({ page: 1, page_size: 8, ordering: "-created_at" }),
      roadmapService.getRoadmapStats(),
      roadmapService.getRoadmaps({ page: 1, page_size: 5, ordering: "-updated_at" }),
      financeService.getSummary({ period: "monthly" }),
      financeService.getTransactions({ page: 1, page_size: 6, ordering: "-occurred_at" }),
    ]);

    return {
      tasks: {
        all: allTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: pendingTasks,
        recent: recentTasks,
      },
      roadmaps: {
        stats: roadmapStats,
        recent: recentRoadmaps,
      },
      finance: {
        summary: financeSummary,
        recentTransactions,
      },
    };
  },
};

