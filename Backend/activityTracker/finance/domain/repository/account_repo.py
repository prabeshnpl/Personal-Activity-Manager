from abc import ABC, abstractmethod
from typing import List
from rest_framework.response import Response
from finance.domain.entity.account_entity import AccountEntity

class AccountRepository(ABC):

    @abstractmethod
    def create_account(self, data: dict, organization:int, role:str) -> AccountEntity | Response:
        pass

    @abstractmethod
    def get_account_by_id(self, id: int, organization:int, role:str) -> AccountEntity| Response:
        pass

    @abstractmethod
    def update_account(self, id: int, data: dict, organization:int, role:str) -> AccountEntity| Response:
        pass

    @abstractmethod
    def delete_account(self, id: int, organization:int, role:str) -> Response:
        pass

    @abstractmethod
    def list_accounts(self, search_params: dict, organization:int, role:str) -> List[AccountEntity]| Response:
        pass
