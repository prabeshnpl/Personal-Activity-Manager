from typing import List
from rest_framework.response import Response
from finance.domain.entity.transaction_entity import TransactionEntity
from finance.domain.repository.transaction_repo import TransactionRepository
from finance.models import Transaction
from django.db import transaction
from django.utils.dateparse import parse_datetime

class TransactionRepositoryImpl(TransactionRepository):
    def list_transactions(self, search_params: dict, organization:int, role:str) -> List[TransactionEntity] | Response:
        try:
            transactions = Transaction.objects.\
                select_related("category", "account").\
                filter(organization=organization).\
                order_by('-occurred_at')

            if transaction_type:=search_params.get("type"):
                transactions = transactions.filter(transaction_type=transaction_type)

            if category:=search_params.get('category'):
                transactions = transactions.filter(category=category)

            if startDate:=search_params.get('startDate'):
                dt = parse_datetime(startDate)
                if dt is None:
                    raise ValueError(f"Invalid date_published format: {startDate}. Use ISO 8601 format (e.g., 2025-01-15T10:30:00)")
                transactions = transactions.filter(occurred_at__gt=dt)

            if endDate:=search_params.get('endDate'):
                dt = parse_datetime(endDate)
                if dt is None:
                    raise ValueError(f"Invalid date_published format: {endDate}. Use ISO 8601 format (e.g., 2025-01-15T10:30:00)")
                transactions = transactions.filter(occurred_at__lt=dt)

            if search:=search_params.get("search"):
                transactions = transactions.filter(description__icontains = search)
            
            if account:=search_params.get("account"):
                transactions = transactions.filter(account=account)

            return [self.to_entity(transaction) for transaction in transactions]
        except Exception as e:
            print(f"Error occured in fetching transactions:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def create_transaction(self, data: dict, organization:int, role:str) -> TransactionEntity | Response:
        try:
            with transaction.atomic(): # type: ignore
                if data.get('transaction_type') not in ['income', 'expense']:
                    return Response({'detail':"Invalid transaction_type"}, status=400)

                account = data.get('account')
                if data.get('transaction_type')=='expense' and account.balance < data.get("amount"): # type: ignore
                    return Response({'detail':'Not enough money in this account'}, status=400)

                _transaction = Transaction.objects.create(**data)

                if _transaction.transaction_type == 'income':
                    _transaction.account.balance += _transaction.amount
                    _transaction.account.save()
                else:
                    _transaction.account.balance -= _transaction.amount
                    _transaction.account.save()
                    
                return self.to_entity(_transaction)
        except Exception as e:
            print(f"Error occured while creating transaction:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def update_transaction(self, id: int, data: dict, organization:int, role:str) -> TransactionEntity | Response:
        try:
            transaction = Transaction.objects.filter(organization=organization, id=id).first()
            if not transaction:
                return Response({'detail':'Invalid transaction'}, status=400)

            for key, value in data.items():
                if key in ['id', 'organization', 'created_at', 'account', 'created_by']:
                    continue
                elif key=='transaction_type':
                    if value not in ['income', 'expense']:
                        return Response({'detail':"Invalid transaction_type"}, status=400)
                setattr(transaction, key, value)
            
            transaction.save()

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