from roadmap.models import Roadmap
from rest_framework import serializers

class RoadmapSerializer(serializers.ModelSerializer):

    milestones_count = serializers.IntegerField(required = False)
    completed_milestones_count = serializers.IntegerField(required = False)
    completed_hours = serializers.IntegerField(required = False)

    class Meta:
        model=Roadmap
        fields='__all__'
    
