import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";
import { useState } from "react";
    
export function useNotifications() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    is_read: null, // null = all, true = read, false = unread
    notification_type: null,
  });

  // Infinite scroll for notification list
  const notificationsQuery = useInfiniteQuery({
    queryKey: ["notifications", filters],
    queryFn: ({ pageParam = 1 }) =>
      notificationService.getNotifications({ ...filters, page: pageParam, page_size: 15 }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.next) {
        const url = new URL(lastPage.data.next);
        return url.searchParams.get('page');
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Unread count - polled periodically for badge
  const unreadCount = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 30000, // Poll every 30s
    refetchIntervalInBackground: false,
  });

  // Mutations
  const markAsRead = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const deleteNotification = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const clearRead = useMutation({
    mutationFn: notificationService.clearReadNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  // Flatten paginated results
  const notifications = notificationsQuery.data?.pages.flatMap(
    (page) => page?.data?.results
  ) || [];

  const totalCount = notificationsQuery.data?.pages[0]?.data?.count || 0;

  return {
    // Data
    notifications,
    totalCount,
    unreadCount: unreadCount.data?.data?.count || 0,

    // Loading states
    isLoading: notificationsQuery.isLoading,
    isFetchingNextPage: notificationsQuery.isFetchingNextPage,
    hasNextPage: notificationsQuery.hasNextPage,

    // Actions
    fetchNextPage: notificationsQuery.fetchNextPage,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearRead,

    // Filters
    filters,
    setFilters,

    refetch: notificationsQuery.refetch,
  };
}