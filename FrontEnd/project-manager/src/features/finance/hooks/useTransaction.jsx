import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "../services/financeService";
import { useState } from "react";

export function useTransaction() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    type: null, // income, expense
    category: null,
    startDate: null,
    endDate: null,
    member: null,
    search: null
  });

  // Queries
  const transactions = useQuery({
    queryKey: ["finance", "transactions", filters],
    queryFn: () => financeService.getTransactions(filters),
    retry: false
  });

  const categories = useQuery({
    queryKey: ["finance", "categories"],
    queryFn:  () => financeService.getCategories(),
    retry: false
  });

  // Transaction Mutations
  const createTransaction = useMutation({
    mutationFn: financeService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(["finance"]);
    },
  });

  const updateTransaction = useMutation({
    mutationFn: ({ id, data }) => financeService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["finance"]);
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: financeService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(["finance"]);
    },
  });

  const accounts = useQuery({
    queryKey: ["finance", "accounts"],
    queryFn: () => financeService.getAccounts(),
    retry: false
  });

  const exportTransactions = async (format = 'csv') => {
    try {
      const response = await financeService.exportTransactions(format, filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  };


  return {
    // Data
    transactions: transactions,
    categories: categories,
    accounts: accounts,

    // Filters
    filters,
    setFilters,

    // Mutations
    createTransaction,
    updateTransaction,
    deleteTransaction,
    
    exportTransactions,
  };
}