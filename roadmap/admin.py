from django.contrib import admin
from roadmap.models import Roadmap, Milestone, ProgressSnapshot, RoadmapNotes

# Register your models here.
@admin.register(Roadmap)
class RoadmapAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'type']
    
@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'roadmap', 'start_date', 'due_date']

@admin.register(ProgressSnapshot)
class ProgressSnapshotAdmin(admin.ModelAdmin):
    list_display = ['id', 'roadmap', 'snapshot_date',]

@admin.register(RoadmapNotes)
class RoadmapNotesAdmin(admin.ModelAdmin):
    list_display = ['id', 'roadmap', 'title']
