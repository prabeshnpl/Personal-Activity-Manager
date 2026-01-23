from abc import ABC, abstractmethod
from typing import List
from finance.domain.entity.account_entity import AccountEntity

class AccountRepository(ABC):

    @abstractmethod
    def create_account(self, data: dict) -> AccountEntity:
        pass

    @abstractmethod
    def get_account_by_id(self, id: int) -> AccountEntity:
        pass

    @abstractmethod
    def update_account(self, id: int, data: dict) -> AccountEntity:
        pass

    @abstractmethod
    def delete_account(self, id: int) -> AccountEntity:
        pass

    @abstractmethod
    def list_accounts(self, search_params: dict) -> List[AccountEntity]:
        pass
