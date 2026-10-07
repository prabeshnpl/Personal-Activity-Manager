from roadmap.models import Milestone
from rest_framework import serializers

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model=Milestone
        fields='__all__'
        