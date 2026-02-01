from rest_framework import serializers
from user.adapter.serializers.user_serializer import CustomUserSerializer

class LoginTokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return CustomUserSerializer(obj.user, context=self.context).data
    