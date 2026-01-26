from abc import ABC, abstractmethod
from typing import List
from finance.domain.entity.transaction_entity import TransactionEntity
from rest_framework.response import Response

class TransactionRepository(ABC):

    @abstractmethod
    def create_transaction(self, data: dict, organization:int, role:str) -> TransactionEntity | Response:
        pass

    @abstractmethod
    def get_transaction_by_id(self, id: int, organization:int, role:str) -> TransactionEntity | Response:
        pass

    @abstractmethod
    def update_transaction(self, id: int, data: dict, organization:int, role:str) -> TransactionEntity | Response:
        pass

    @abstractmethod
    def delete_transaction(self, id: int, organization:int, role:str) ->  Response:
        pass

    @abstractmethod
    def list_transactions(self, search_params: dict, organization:int, role:str) -> List[TransactionEntity] | Response:
        pass

