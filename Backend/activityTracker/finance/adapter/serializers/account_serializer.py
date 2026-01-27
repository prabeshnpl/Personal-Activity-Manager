from finance.models import Account
from rest_framework import serializers

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'name', 'organization', 'account_type', 'is_active', 'created_at']
        extra_kwargs = {
            'account_type': {'choices': ['cash', 'bank', 'digital']}
        }
