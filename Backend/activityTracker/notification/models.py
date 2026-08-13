# notifications/models.py

from django.db import models
from organization.models import Organization
from user.models import CustomUser


class Notification(models.Model):

    NOTIFICATION_TYPE_CHOICES = (
        # Task-related notifications
        ('task_delay', 'Task Delay'),
        ('task_assigned', 'Task Assigned'),
        ('task_completed', 'Task Completed'),

        # Finance-related notifications
        ('finance_alert', 'Finance Alert'),
        ('budget_exceeded', 'Budget Exceeded'),
        ('transaction_added', 'Transaction Added'),

        # Roadmap-related notifications
        ('roadmap_milestone', 'Roadmap Milestone'),
        ('roadmap_delayed', 'Roadmap Delayed'),

        # Member/organization notifications
        ('member_invited', 'Member Invited'),
        ('member_joined', 'Member Joined'),
        ('role_changed', 'Role Changed'),
        ('organization_updated', 'Organization Updated'),
    )

    SOURCE_TYPE_CHOICES = (
        ('TASK', 'Task'),
        ('FINANCE', 'Finance'),
        ('ROADMAP', 'Roadmap'),
        ('MILESTONE', 'Milestone'),
        ('ORGANIZATION', 'Organization'),
        ('MEMBER', 'Member'),
    )

    organization = models.ForeignKey(
        Organization,
        related_name="notifications",
        on_delete=models.CASCADE
    )

    recipient = models.ForeignKey(
        CustomUser,
        related_name="notifications",
        on_delete=models.CASCADE
    )

    notification_type = models.CharField(
        max_length=64,
        choices=NOTIFICATION_TYPE_CHOICES
    )

    title = models.CharField(max_length=255)
    message = models.TextField()

    source_type = models.CharField(
        max_length=64,
        choices=SOURCE_TYPE_CHOICES
    )
    
    source_id = models.PositiveIntegerField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class NotificationChannel(models.Model):
    name = models.CharField(max_length=32, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class NotificationDelivery(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    )

    notification = models.ForeignKey(
        Notification,
        related_name="deliveries",
        on_delete=models.CASCADE
    )

    channel = models.ForeignKey(
        NotificationChannel,
        on_delete=models.CASCADE
    )

    status = models.CharField(
        max_length=16,
        choices=STATUS_CHOICES,
        default='pending'
    )

    attempt_count = models.PositiveIntegerField(default=0)
    last_attempt_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)


class NotificationSchedule(models.Model):
    notification = models.ForeignKey(
        Notification,
        related_name="schedules",
        on_delete=models.CASCADE
    )

    scheduled_at = models.DateTimeField()
    is_processed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
