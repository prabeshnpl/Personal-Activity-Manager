from rest_framework import serializers

class SummarySerializer(serializers.Serializer):
    income = serializers.FloatField(required=False)
    expenses = serializers.FloatField(required=False)
    balance = serializers.FloatField(required=False)
    savings_ratio = serializers.FloatField(required=False)
    avg_daily_expense = serializers.FloatField(required=False)
    expense_ratio = serializers.FloatField(required=False)
    income_trend = serializers.DictField(required=False)
    expenses_trend = serializers.DictField(required=False)
    