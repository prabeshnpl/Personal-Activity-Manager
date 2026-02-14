import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useInfiniteList from '../../../shared/hooks/useInfiniteList';
import { financeService } from "../services/financeService";
import { useState } from "react";

export function useTransaction() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    type: null, // income, expense
    category: null,
    account: null,
    startDate: null,
    endDate: null,
    member: null,
    search: null
  });

  // Queries

  // Infinite loader for transactions
  const getInfiniteTransactions = (overrideFilters = null) => {
    const combined = { ...filters, ...(overrideFilters || {}) };
    return useInfiniteList(
      ["finance", "transactions", "infinite"], 
      (params) => financeService.getTransactions({ ...combined, ...params, page_size:5 }), 
      [combined]
    );
  };

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
    categories: categories,
    accounts: accounts,
    getInfiniteTransactions,

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