from rest_framework import serializers

class SummarySerializer(serializers.Serializer):
    income = serializers.FloatField(required=False)
    expenses = serializers.FloatField(required=False)
    balance = serializers.FloatField(required=False)
    income_trend = serializers.DictField(required=False)
    expenses_trend = serializers.DictField(required=False)
    