from organization.models import Member
from rest_framework import serializers
from user.adapter.serializers.user_serializer import CustomUserSerializer

class MemberSerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = "__all__"

    def get_user(self, instance):
        return CustomUserSerializer(instance.user).data