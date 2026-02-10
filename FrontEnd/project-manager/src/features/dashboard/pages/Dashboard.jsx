import React, { useEffect } from 'react';
import { useOrganizationstore } from '../../organization/hooks/useOrganizationstore';
import { StatsCard } from '../components/StatsCard';
import { QuickActions } from '../components/QuickActions';
import { Card } from '../../../shared/components/Card';
import { Spinner } from '../../../shared/components/Spinner';
import { CheckSquare, Map, DollarSign, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const { activeOrganization, loading } = useOrganizationstore();

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard (This page is static)</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Tasks"
          value="12"
          icon={CheckSquare}
          color="blue"
          trend={{ value: '+3 from last week', positive: true }}
        />
        <StatsCard
          title="Roadmaps"
          value="3"
          icon={Map}
          color="purple"
        />
        <StatsCard
          title="Total Balance"
          value="$5,420"
          icon={DollarSign}
          color="green"
          trend={{ value: '+12.5% from last month', positive: true }}
        />
        <StatsCard
          title="Progress"
          value="68%"
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        </div>
      </Card>
    </div>
  );
};