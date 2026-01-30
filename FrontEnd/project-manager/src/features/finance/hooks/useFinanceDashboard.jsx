import { useQuery, useQueryClient } from "@tanstack/react-query";
import { financeService } from "../services/financeService";
import { useState } from "react";

export function useFinance() {
  const queryClient = useQueryClient();
  
  const [period, setPeriod] = useState('monthly'); // daily, monthly, yearly

  const summary = useQuery({
    queryKey: ["finance", "summary", period],
    queryFn: () => financeService.getSummary(period),
    retry: false
  });

  return {
    summary: summary,
    period,
    setPeriod,
  };
}