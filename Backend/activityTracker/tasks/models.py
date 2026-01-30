from django.db import models
from organization.models import Organization
from user.models import CustomUser

class Task(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    organization = models.ForeignKey(
        Organization,
        related_name="tasks",
        on_delete=models.CASCADE
    )

    created_by = models.ForeignKey(
        CustomUser,
        related_name="created_tasks",
        on_delete=models.SET_NULL,
        null=True
    )

    assigned_to = models.ManyToManyField(
        CustomUser,
        related_name="assigned_tasks",
        null=True,
        blank=True
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=32,
        choices=STATUS_CHOICES,
        default='pending'
    )

    priority = models.CharField(
        max_length=32,
        choices=PRIORITY_CHOICES,
        default='medium'
    )

    due_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    is_deleted = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
