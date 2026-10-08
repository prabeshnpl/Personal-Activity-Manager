from finance.models import Transaction
from rest_framework import serializers

class TransactionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Transaction
        fields = "__all__"
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['category'] = {
            'id':instance.category.id,
            'name':instance.category.name
        } if instance.category else {}
        rep['account'] = {
            'id':instance.account.id,
            'name':instance.account.name
        } if instance.account else {}
        rep['to_account'] = {
            'id':instance.to_account.id,
            'name':instance.to_account.name
        } if instance.to_account else {}
        
        return rep
    