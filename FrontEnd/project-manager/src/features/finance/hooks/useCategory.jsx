import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "../services/financeService";

export function useCategory() {

  const queryClient = useQueryClient();
  const filters = {
    type: null, // income, expense
    category: null,
    startDate: null,
    endDate: null,
    member: null,
  };
    
  const categories = useQuery({
    queryKey: ["finance", "categories"],
    queryFn:  () => financeService.getCategories(),
    retry: false
  });

  const categoryBreakdown = useQuery({
    queryKey: ["finance", "category-breakdown", filters],
    queryFn: () => financeService.getCategoryBreakdown(filters),
    retry: false
  });

  // Category Mutations
  const createCategory = useMutation({
    mutationFn: financeService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["finance", "categories"]);
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }) => financeService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["finance", "categories"]);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: financeService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["finance", "categories"]);
    },
  });

  return {   
    categories: categories,
    categoryBreakdown: categoryBreakdown,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
