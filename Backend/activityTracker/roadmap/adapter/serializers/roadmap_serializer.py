from roadmap.models import Roadmap
from rest_framework import serializers

class RoadmapSerializer(serializers.ModelSerializer):

    milestones_count = serializers.IntegerField()
    completed_milestones_count = serializers.IntegerField()
    completed_hours = serializers.IntegerField()

    class Meta:
        model=Roadmap
        fields='__all__'
    
