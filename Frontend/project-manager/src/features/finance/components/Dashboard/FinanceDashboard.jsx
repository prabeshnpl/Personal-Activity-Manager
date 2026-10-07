import { useFinance } from "../../hooks/useFinanceDashboard";
import { Spinner } from "../../../../shared/components/Spinner";
import ErrorState from "../../../../shared/components/Error/ErrorState";
import { normalizeTrendData } from "./utils";
import { DashboardFilters } from "./components/DashboardFilters";
import { SummaryStatsGrid } from "./components/SummaryStatsGrid";
import { TrendChartCard } from "./components/TrendChartCard";
import { AnalyticalHighlightsCard } from "./components/AnalyticalHighlightsCard";
import { InsightsCard } from "./components/InsightsCard";

export const FinanceDashboard = () => {
  const {
    summary,
    incomeExpenseTrend,
    categories,
    accounts,
    period,
    setPeriod,
    categoryId,
    setCategoryId,
    accountId,
    setAccountId,
  } = useFinance();

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = summary;
  const {
    data: trendResponse,
    isLoading: trendLoading,
    error: trendError,
    refetch: refetchTrend,
  } = incomeExpenseTrend;
  const { data: categoriesData } = categories;
  const { data: accountsData } = accounts;

  const chartData = normalizeTrendData(
    trendResponse?.series || trendResponse?.data || []
  );
  const totalIncomeFromSeries = chartData.reduce(
    (sum, row) => sum + row.income,
    0
  );
  const totalExpenseFromSeries = chartData.reduce(
    (sum, row) => sum + row.expense,
    0
  );
  const avgIncomePerBucket = chartData.length
    ? totalIncomeFromSeries / chartData.length
    : 0;
  const avgExpensePerBucket = chartData.length
    ? totalExpenseFromSeries / chartData.length
    : 0;

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (summaryError) {
    return (
      <ErrorState
        message="Failed to load dashboard summary."
        onRetry={refetchSummary}
      />
    );
  }

  return (
    <div className="space-y-6 mt-5">
      <DashboardFilters
        period={period}
        setPeriod={setPeriod}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        accountId={accountId}
        setAccountId={setAccountId}
        categoriesData={categoriesData}
        accountsData={accountsData}
      />

      <SummaryStatsGrid
        summaryData={summaryData}
        totalIncomeFromSeries={totalIncomeFromSeries}
        totalExpenseFromSeries={totalExpenseFromSeries}
      />

      <TrendChartCard
        period={period}
        categoryId={categoryId}
        accountId={accountId}
        trendLoading={trendLoading}
        trendError={trendError}
        refetchTrend={refetchTrend}
        chartData={chartData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticalHighlightsCard
          avgIncomePerBucket={avgIncomePerBucket}
          avgExpensePerBucket={avgExpensePerBucket}
          summaryData={summaryData}
        />
        <InsightsCard summaryData={summaryData} />
      </div>
    </div>
  );
};
