from rest_framework import serializers
from user.models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'first_name', 'last_name', 'username',
            'email', 'updated_at', 'created_at', 'contact_number', 
            'is_active', 'is_deleted', 'profile_picture', 'is_disabled'
        ]
