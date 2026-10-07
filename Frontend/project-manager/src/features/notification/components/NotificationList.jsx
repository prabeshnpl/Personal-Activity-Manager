import React, { useRef, useCallback } from 'react';
import { NotificationItem } from './NotificationItem';
import { Spinner } from '../../../shared/components/Spinner';
import { Bell } from 'lucide-react';

export const NotificationList = ({
  notifications,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  onMarkAsRead,
  onDelete,
  onClose,
}) => {
  const observerRef = useRef();

  // Infinite scroll observer
  const lastItemRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="p-3 bg-gray-100 rounded-full mb-3">
          <Bell className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-900">No notifications</p>
        <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
      {notifications.map((notification, index) => (
        <div
          key={notification?.id}
          ref={index === notifications?.length - 1 ? lastItemRef : null}
        >
          <NotificationItem
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            onClose={onClose}
          />
        </div>
      ))}

      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4">
          <Spinner size="sm" />
        </div>
      )}
    </div>
  );
};