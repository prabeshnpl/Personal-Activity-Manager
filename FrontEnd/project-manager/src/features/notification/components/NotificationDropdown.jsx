import React from 'react';
import { CheckCheck, Trash2, X } from 'lucide-react';
import { NotificationFilters } from './NotificationFilters';
import { NotificationList } from './NotificationList';

export const NotificationDropdown = ({
  notifications,
  unreadCount,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  filters,
  setFilters,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearRead,
  onClose,
}) => {
  const hasUnread = unreadCount > 0;
  const hasReadNotifications = notifications.some((n) => n?.is_read);

  return (
    <>
      {/* Backdrop for mobile */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      <div className="absolute right-0 mt-2 w-full sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {hasUnread && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg sm:hidden"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Filters */}
        <NotificationFilters filters={filters} onFilterChange={setFilters} />

        {/* Notification List */}
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          onClose={onClose}
        />

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onMarkAllAsRead}
              disabled={!hasUnread}
              className="flex items-center space-x-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark all as read</span>
            </button>

            <button
              onClick={onClearRead}
              disabled={!hasReadNotifications}
              className="flex items-center space-x-1.5 text-xs font-medium text-gray-600 hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear read</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};