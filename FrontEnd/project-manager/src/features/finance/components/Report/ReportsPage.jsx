import React from 'react';
import { useReports } from '../../hooks/useReports';
import { useFinance } from '../../hooks/useFinanceDashboard';
import { ReportFilters } from './ReportFilters';
import { ReportSummary } from './ReportSummary';
import { CategoryBreakdown } from './CategoryBreakdown';
import { AccountComparison } from './AccountComparison';
import { MonthlyComparison } from './MonthlyComparison';
import { TrendChart } from './TrendChart';
import { ExportReport } from './ExportReport';
import { Spinner } from '../../../../shared/components/Spinner';
import { FileBarChart } from 'lucide-react';

export const ReportsPage = () => {
  const {
    detailedReport,
    categoryBreakdown,
    accountBreakdown,
    monthlyComparison,
    trendAnalysis,
    cashFlow,
    isLoading,
    isLoadingCategory,
    isLoadingAccount,
    isLoadingMonthly,
    filters,
    setFilters,
    exportReport,
  } = useReports();

  const { categories, accounts } = useFinance();

  const handleResetFilters = () => {
    setFilters({
      type: null,
      category: [],
      account: [],
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      groupBy: 'category',
    });
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <FileBarChart className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
            <p className="text-sm text-gray-600">Comprehensive analysis of your finances</p>
          </div>
        </div>
        <ExportReport onExport={exportReport} />
      </div>

      {/* Filters */}
      <ReportFilters
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        accounts={accounts}
        onReset={handleResetFilters}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Summary */}
          <ReportSummary summary={detailedReport.summary} filters={filters} />

          {/* Category & Account Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-96 overflow-clip">
              <CategoryBreakdown data={categoryBreakdown} isLoading={isLoadingCategory} />
              <AccountComparison data={accountBreakdown} isLoading={isLoadingAccount} />
          </div>

          {/* Monthly Comparison */}
          <MonthlyComparison data={monthlyComparison} isLoading={isLoadingMonthly} />

          {/* Trend Analysis */}
          <TrendChart data={trendAnalysis} cashFlow={cashFlow} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};