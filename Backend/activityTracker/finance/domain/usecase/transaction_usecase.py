from typing import List
from finance.domain.entity.transaction_entity import TransactionEntity
from finance.domain.repository.transaction_repo import TransactionRepository
from rest_framework.response import Response

class CreateTransactionUseCase:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def execute(self, data: dict, organization:int, role:str) -> TransactionEntity | Response:
        return self.repo.create_transaction(data=data, organization=organization, role=role)


class GetTransactionByIdUseCase:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> TransactionEntity | Response:
        return self.repo.get_transaction_by_id(id=id, organization=organization, role=role)


class UpdateTransactionUseCase:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def execute(self, id: int, data: dict, organization:int, role:str) -> TransactionEntity | Response:
        return self.repo.update_transaction(id=id, data=data, organization=organization, role=role)


class DeleteTransactionUseCase:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> Response:
        return self.repo.delete_transaction(id=id, organization=organization, role=role)


class ListTransactionsUseCase:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def execute(self, search_params: dict, organization:int, role:str) -> List[TransactionEntity] | Response:
        return self.repo.list_transactions(search_params=search_params, organization=organization, role=role)