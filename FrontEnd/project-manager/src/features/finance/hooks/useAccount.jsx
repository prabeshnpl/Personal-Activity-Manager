import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "../services/financeService";

export function useAccount() {
  const queryClient = useQueryClient();
  
  const accounts = useQuery({
    queryKey: ["finance", "accounts"],
    queryFn: () => financeService.getAccounts(),
    retry: false
  });

  // Account Mutations
  const createAccount = useMutation({
    mutationFn: financeService.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["finance", "accounts"]);
    },
  });

  const updateAccount = useMutation({
    mutationFn: ({ id, data }) => financeService.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["finance", "accounts"]);
    },
  });

  const deleteAccount = useMutation({
    mutationFn: financeService.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["finance", "accounts"]);
      queryClient.invalidateQueries(["finance", "transactions"]);
    },
  });

  return {
    accounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}