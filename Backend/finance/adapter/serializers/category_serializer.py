from finance.models import Category
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class CategoryBreakdownSerializer(CategorySerializer):
    total = serializers.FloatField(required=False)