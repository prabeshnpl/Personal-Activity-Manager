from roadmap.models import RoadmapNotes
from rest_framework import serializers

class RoadmapNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model=RoadmapNotes
        fields='__all__'
        