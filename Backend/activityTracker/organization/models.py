from django.db import models
from user.models import CustomUser

# Create your models here.
class Organization(models.Model):
    TYPE_CHOICES = (
        ('personal', 'PERSONAL'),
        ('family', 'FAMILY'),
        ('business', 'BUSINESS'),
    )
    name = models.CharField(max_length=128)
    type = models.CharField(choices=TYPE_CHOICES, max_length=128)

    created_by = models.ForeignKey(CustomUser, related_name="created_organizations", on_delete=models.CASCADE)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"

class Member(models.Model):
    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('member', 'Member'),
    )

    organization = models.ForeignKey(Organization, related_name="members", on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name="memberships", on_delete=models.CASCADE)
    role = models.CharField(choices=ROLE_CHOICES, max_length=128)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('organization', 'user')

    def __str__(self):
        return f"{self.user.email}"
    