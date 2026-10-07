from rest_framework import serializers
from user.adapter.serializers.user_serializer import CustomUserSerializer

class LoginTokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    user = CustomUserSerializer()

    