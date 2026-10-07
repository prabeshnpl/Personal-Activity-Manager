import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle, CheckSquare, CheckCircle2, DollarSign, AlertTriangle,
  Receipt, Target, TrendingDown, UserPlus, Users, Shield, Building2, Bell,
  Trash2, Circle
} from 'lucide-react';
import { getNotificationRoute, getNotificationStyle } from '../utils/notificationRouting';

const iconMap = {
  AlertCircle, CheckSquare, CheckCircle2, DollarSign, AlertTriangle,
  Receipt, Target, TrendingDown, UserPlus, Users, Shield, Building2, Bell,
};

const colorClasses = {
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  purple: 'bg-purple-100 text-purple-600',
  gray: 'bg-gray-100 text-gray-600',
};

export const NotificationItem = ({ notification, onMarkAsRead, onDelete, onClose }) => {
  const navigate = useNavigate();
  const { icon, color } = getNotificationStyle(notification?.notification_type);
  const Icon = iconMap[icon] || Bell;

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleClick = () => {
    // Mark as read first if unread
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }

    // Navigate to source page
    const route = getNotificationRoute(notification);
    if (route) {
      navigate(route);
      onClose?.();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex items-start space-x-3 p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
        !notification?.is_read ? 'bg-blue-50/50' : ''
      }`}
    >
      {/* Unread indicator */}
      {!notification?.is_read && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 bg-blue-600 rounded-full"></div>
      )}

      {/* Icon */}
      <div className={`p-2 rounded-full shrink-0 ${colorClasses[color]}`}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${!notification?.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
          {notification?.title}
        </p>
        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
          {notification?.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatRelativeTime(notification?.created_at)}
        </p>
      </div>

      {/* Delete button - visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification?.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};