from roadmap.models import Roadmap
from rest_framework import serializers

class RoadmapSerializer(serializers.ModelSerializer):
    class Meta:
        model=Roadmap
        fields='__all__'
        