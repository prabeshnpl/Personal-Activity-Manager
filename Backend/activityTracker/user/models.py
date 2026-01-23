from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "password"] 

    username = models.CharField(max_length=128, blank=True, null=True)
    email = models.EmailField(unique=True)
    contact_number = models.CharField(max_length=64, blank=True, null=True)

    google_id = models.CharField(max_length=128, blank=True, null=True)
    apple_id = models.CharField(max_length=128, blank=True, null=True)
    
    is_deleted = models.BooleanField(default=False)
    is_disabled = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.email