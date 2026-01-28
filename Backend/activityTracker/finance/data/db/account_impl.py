from typing import List
from rest_framework.response import Response
from finance.domain.entity.account_entity import AccountEntity
from finance.domain.repository.account_repo import AccountRepository
from finance.models import Account

class AccountRepositoryImpl(AccountRepository):
    def list_accounts(self, search_params: dict, organization:int, role:str) -> List[AccountEntity] | Response:
        try:
            accounts = Account.objects.filter(organization=organization)

            return [self.to_entity(account) for account in accounts]
        except Exception as e:
            print(f"Error occured in fetching accounts:{repr(e)}")
            return Response({'detail':f"{str(e)}"}, status=500)
        
    def create_account(self, data: dict, organization:int, role:str) -> AccountEntity | Response:
        try:
            if data.get('account_type') not in ['cash', 'bank', 'digital']:
                return Response({'detail':"Invalid account_type"}, status=400)
            account = Account.objects.create(**data)
            
            return self.to_entity(account)
        except Exception as e:
            print(f"Error occured while creating account:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def update_account(self, id: int, data: dict, organization:int, role:str) -> AccountEntity | Response:
        try:
            account = Account.objects.filter(organization=organization, id=id).first()
            if not account:
                return Response({'detail':'Invalid account'}, status=400)

            for key, value in data.items():
                if key in ['id', 'organization', 'created_at']:
                    continue
                elif key=='account_type':
                    if value not in ['cash', 'bank', 'digital']:
                        return Response({'detail':"Invalid account_type"}, status=400)
                setattr(account, key, value)

            account.save()

            return self.to_entity(account) # type: ignore
            
        except Exception as e:
            print(f"Error occured while updating account:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def get_account_by_id(self, id: int, organization:int, role:str) -> AccountEntity | Response:
        try:
            account = Account.objects.filter(organization=organization, id=id).first()
            return self.to_entity(account) # type: ignore
        except Exception as e:
            print(f"Error occured while creating account:{repr(e)}")
            return Response({"detail":f"str{e}"}, status=500)
    
    def delete_account(self, id: int, organization:int, role:str) -> Response:
        account = Account.objects.filter(organization=organization, id=id).first()
        if account:
            account.delete() 
            return Response({'detail':"Deleted successfully"})
        return Response({'detail':"Not found"}, status=400)
    
    def to_entity(self, obj:Account):
        return AccountEntity(
            id=obj.id, # type: ignore
            organization=obj.organization,
            name=obj.name,
            account_type=obj.account_type,    
            is_active=obj.is_active,  
            balance=obj.balance,      
            created_at=obj.created_at,
        )