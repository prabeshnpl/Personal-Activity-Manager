import React from 'react';
import { useOrganizationstore } from '../../organization/hooks/useOrganizationstore';
import { StatsCard } from '../components/StatsCard';
import { QuickActions } from '../components/QuickActions';
import { Spinner } from '../../../shared/components/Spinner';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import { CheckSquare, Map, Wallet, TrendingUp } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardHealth } from '../components/DashboardHealth';
import { DashboardRecentActivity } from '../components/DashboardRecentActivity';

export const Dashboard = () => {
  const { activeOrganization, loading } = useOrganizationstore();
  const { metrics, sectionStatus } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!activeOrganization) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No active organization</p>
      </div>
    );
  }

  const safeMetrics = metrics || {
    cards: { activeTasks: 0, roadmaps: 0, monthlyBalance: 0, taskCompletionRate: 0 },
    tasks: { completed: 0, inProgress: 0, pending: 0, completionRate: 0 },
    roadmaps: { completionRate: 0, completed: 0, total: 0 },
    finance: { income: 0, expense: 0, balance: 0 },
    recentActivity: [],
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm sm:text-base">
          Live view of tasks, roadmaps, and finance for your active organization.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Active Tasks"
          value={sectionStatus.tasks.isLoading ? '...' : safeMetrics.cards.activeTasks}
          icon={CheckSquare}
          color="blue"
          trend={
            sectionStatus.tasks.error
              ? { value: 'Failed to load task metrics', positive: false }
              : { value: `${safeMetrics.tasks.completed} completed`, positive: true }
          }
        />
        <StatsCard
          title="Roadmaps"
          value={sectionStatus.roadmaps.isLoading ? '...' : safeMetrics.cards.roadmaps}
          icon={Map}
          color="purple"
          trend={
            sectionStatus.roadmaps.error
              ? { value: 'Failed to load roadmap stats', positive: false }
              : {
                  value: `${safeMetrics.roadmaps.completionRate}% completion rate`,
                  positive: safeMetrics.roadmaps.completionRate >= 50,
                }
          }
        />
        <StatsCard
          title="Monthly Balance"
          value={
            sectionStatus.finance.isLoading
              ? '...'
              : formatCurrency(safeMetrics.cards.monthlyBalance)
          }
          icon={Wallet}
          color="green"
          trend={
            sectionStatus.finance.error
              ? { value: 'Failed to load finance summary', positive: false }
              : {
                  value: `Income ${formatCurrency(safeMetrics.finance.income)}`,
                  positive: safeMetrics.cards.monthlyBalance >= 0,
                }
          }
        />
        <StatsCard
          title="Task Completion"
          value={
            sectionStatus.tasks.isLoading ? '...' : `${safeMetrics.cards.taskCompletionRate}%`
          }
          icon={TrendingUp}
          color="yellow"
          trend={
            sectionStatus.tasks.error
              ? { value: 'Failed to load task progress', positive: false }
              : {
                  value: `${safeMetrics.tasks.inProgress} currently in progress`,
                  positive: safeMetrics.cards.taskCompletionRate >= 50,
                }
          }
        />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <DashboardHealth
            tasks={safeMetrics.tasks}
            roadmaps={safeMetrics.roadmaps}
            finance={safeMetrics.finance}
            isLoading={sectionStatus.health.isLoading}
            error={sectionStatus.health.error}
            onRetry={sectionStatus.health.refetch}
          />
        </div>
        <div className="xl:col-span-3">
          <DashboardRecentActivity
            items={safeMetrics.recentActivity}
            isLoading={sectionStatus.activity.isLoading}
            error={sectionStatus.activity.error}
            onRetry={sectionStatus.activity.refetch}
          />
        </div>
      </div>
    </div>
  );
};
