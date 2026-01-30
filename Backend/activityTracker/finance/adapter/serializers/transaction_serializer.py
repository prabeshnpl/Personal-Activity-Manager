from finance.models import Transaction
from rest_framework import serializers

class TransactionSerializer(serializers.ModelSerializer):

    category = serializers.SerializerMethodField()
    # member = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = "__all__"
    
    def get_category(self, instance):
        category = getattr(instance, "category", None)
        if category:
            return {
                'id':instance.category.id,
                'name':instance.category.name
            }
        return {}