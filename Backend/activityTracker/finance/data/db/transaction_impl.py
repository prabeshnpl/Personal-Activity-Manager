from typing import List
from rest_framework.response import Response
from finance.domain.entity.transaction_entity import TransactionEntity
from finance.domain.repository.transaction_repo import TransactionRepository
from finance.models import Transaction

class TransactionRepositoryImpl(TransactionRepository):
    def list_transactions(self, search_params: dict, organization:int, role:str) -> List[TransactionEntity] | Response:
        try:
            transactions = Transaction.objects.filter(organization=organization)
            
            if transaction_type:=search_params.get("transaction_type"):
                transactions.filter(transaction_type=transaction_type)

            return [self.to_entity(transaction) for transaction in transactions]
        except Exception as e:
            print(f"Error occured in fetching transactions:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def create_transaction(self, data: dict, organization:int, role:str) -> TransactionEntity | Response:
        try:
            transaction = Transaction.objects.create(**data, organization=organization)
            return self.to_entity(transaction)
        except Exception as e:
            print(f"Error occured while creating transaction:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def update_transaction(self, id: int, data: dict, organization:int, role:str) -> TransactionEntity | Response:
        try:
            transaction = Transaction.objects.filter(organization=organization, id=id).first()

            for key, value in data:
                if key in ['id', 'organization', 'created_at', 'account', 'created_by']:
                    pass
                setattr(transaction, key, value)
                
            return self.to_entity(transaction) # type: ignore
        except Exception as e:
            print(f"Error occured while updating transaction:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def get_transaction_by_id(self, id: int, organization:int, role:str) -> TransactionEntity | Response:
        try:
            transaction = Transaction.objects.filter(organization=organization, id=id).first()
            return self.to_entity(transaction) # type: ignore
        except Exception as e:
            print(f"Error occured while getting transaction:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def delete_transaction(self, id: int, organization:int, role:str) -> Response:
        transaction = Transaction.objects.filter(organization=organization, id=id).first()
        if transaction:
            transaction.delete() 
            return Response({'detail':"Deleted successfully"})
        return Response({'detail':"Not found"}, status=400)
    
    def to_entity(self, obj:Transaction):
        return TransactionEntity(
            id=obj.id, # type: ignore
            organization=obj.organization,
            account=obj.account,
            transaction_type=obj.transaction_type,    
            category=obj.category,      
            created_by = obj.created_by,  
            amount = obj.amount,  
            occurred_at = obj.occurred_at,  
            description = obj.description,  
            created_at=obj.created_at,
        )