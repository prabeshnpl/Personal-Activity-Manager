from django.contrib import admin
from organization.models import Organization, Member

# Register your models here.
@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'type']
    
@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'organization', 'role']
