from finance.domain.entity.transaction_entity import TransactionEntity
from finance.domain.repository.transaction_repo import TransactionRepository


class CreateTransactionUseCase:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def execute(self, data: dict) -> TransactionEntity:
        return self.repo.create_transaction(data=data)


class GetTransactionByIdUseCase:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def execute(self, id: int) -> TransactionEntity:
        return self.repo.get_transaction_by_id(id=id)


class UpdateTransactionUseCase:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> TransactionEntity:
        return self.repo.update_transaction(id=id, data=data)


class DeleteTransactionUseCase:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def execute(self, id: int) -> TransactionEntity:
        return self.repo.delete_transaction(id=id)


class ListTransactionsUseCase:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def execute(self, search_params: dict):
        return self.repo.list_transactions(search_params=search_params)