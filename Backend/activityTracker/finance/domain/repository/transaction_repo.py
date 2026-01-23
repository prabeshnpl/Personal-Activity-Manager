from abc import ABC, abstractmethod
from typing import List
from finance.domain.entity.transaction_entity import TransactionEntity

class TransactionRepository(ABC):

    @abstractmethod
    def create_transaction(self, data: dict) -> TransactionEntity:
        pass

    @abstractmethod
    def get_transaction_by_id(self, id: int) -> TransactionEntity:
        pass

    @abstractmethod
    def update_transaction(self, id: int, data: dict) -> TransactionEntity:
        pass

    @abstractmethod
    def delete_transaction(self, id: int) -> TransactionEntity:
        pass

    @abstractmethod
    def list_transactions(self, search_params: dict) -> List[TransactionEntity]:
        pass

