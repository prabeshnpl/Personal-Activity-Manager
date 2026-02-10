from django.db import models
from organization.models import Organization
from user.models import CustomUser
from tasks.models import Task


class Roadmap(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
    )

    organization = models.ForeignKey(
        Organization,
        related_name="roadmaps",
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    type = models.CharField(max_length=12, choices=(
        ('daily','DAILY'),
        ('weekly','WEEKLY'),
        ('monthly','MONTHLY'),
    ), default='daily')

    target_hours = models.IntegerField(blank=True, null=True)

    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    created_by = models.ForeignKey(
        CustomUser,
        related_name="created_roadmaps",
        on_delete=models.SET_NULL,
        null=True
    )

    status = models.CharField(
        max_length=16,
        choices=STATUS_CHOICES,
        default='active'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Milestone(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('missed', 'Missed'),
    )

    roadmap = models.ForeignKey(
        Roadmap,
        related_name="milestones",
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    start_date = models.DateField()
    due_date = models.DateField()

    completed_at = models.DateTimeField(null=True, blank=True)

    linked_task = models.ForeignKey(
        Task,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    status = models.CharField(
        max_length=16,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ProgressSnapshot(models.Model):
    roadmap = models.ForeignKey(
        Roadmap,
        related_name="snapshots",
        on_delete=models.CASCADE
    )

    snapshot_date = models.DateField()

    expected_completion_percent = models.FloatField()
    actual_completion_percent = models.FloatField()
    delta_percent = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('roadmap', 'snapshot_date')

class RoadmapNotes(models.Model):
    roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=1024)
    content = models.TextField(blank=True, null=True)
    hours_spent = models.FloatField(blank=True, null=True)
    # tags = models.

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    