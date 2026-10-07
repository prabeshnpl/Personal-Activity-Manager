import { useQuery } from "@tanstack/react-query";
import { financeService } from "../services/financeService";
import { useState } from "react";

export function useFinance() {
  const [period, setPeriod] = useState("monthly"); // weekly, monthly, yearly
  const [categoryId, setCategoryId] = useState("all");
  const [accountId, setAccountId] = useState("all");

  const dashboardFilters = {
    period,
    category:
      categoryId && categoryId !== "all" ? categoryId : undefined,
    account:
      accountId && accountId !== "all" ? accountId : undefined,
  };

  const summary = useQuery({
    queryKey: ["finance", "summary", dashboardFilters],
    queryFn: () => financeService.getSummary(dashboardFilters),
    retry: false,
  });

  const incomeExpenseTrend = useQuery({
    queryKey: ["finance", "income-expense-trend", dashboardFilters],
    queryFn: () =>
      financeService.getIncomeExpenseTrend(dashboardFilters),
    retry: false,
  });

  const categories = useQuery({
    queryKey: ["finance", "categories"],
    queryFn: () => financeService.getCategories(),
    retry: false,
  });

  const accounts = useQuery({
    queryKey: ["finance", "accounts"],
    queryFn: () => financeService.getAccounts(),
    retry: false,
  });

  return {
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
  };
}
