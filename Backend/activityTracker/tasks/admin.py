from django.contrib import admin
from tasks.models import Task

# Register your models here.
@admin.register(Task)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['id', 'organization', 'created_by', 'assigned_to']