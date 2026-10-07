export const getNotificationRoute = (notification) => {
  const { source_type, source_id, notification_type } = notification;

  switch (source_type) {
    case 'task':
      return `/tasks?taskId=${source_id}`;

    case 'roadmap':
      return `/roadmaps?roadmapId=${source_id}`;

    case 'milestone':
      return `/roadmaps?milestoneId=${source_id}`;

    case 'finance':
    case 'transaction':
      return `/finance?tab=transactions&transactionId=${source_id}`;

    case 'organization':
    case 'member':
      return `/workspace?tab=members`;

    default:
      return null; // No navigation, just mark as read
  }
};

// Icon/color mapping for visual distinction
export const getNotificationStyle = (notification_type) => {
  const styles = {
    task_delay: { icon: 'AlertCircle', color: 'red' },
    task_assigned: { icon: 'CheckSquare', color: 'blue' },
    task_completed: { icon: 'CheckCircle2', color: 'green' },
    finance_alert: { icon: 'DollarSign', color: 'yellow' },
    budget_exceeded: { icon: 'AlertTriangle', color: 'red' },
    transaction_added: { icon: 'Receipt', color: 'blue' },
    roadmap_milestone: { icon: 'Target', color: 'purple' },
    roadmap_delayed: { icon: 'TrendingDown', color: 'red' },
    member_invited: { icon: 'UserPlus', color: 'blue' },
    member_joined: { icon: 'Users', color: 'green' },
    role_changed: { icon: 'Shield', color: 'purple' },
    organization_updated: { icon: 'Building2', color: 'gray' },
  };

  return styles[notification_type] || { icon: 'Bell', color: 'gray' };
};