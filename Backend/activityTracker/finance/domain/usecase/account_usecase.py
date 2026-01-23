from finance.domain.entity.account_entity import AccountEntity
from finance.domain.repository.account_repo import AccountRepository


class CreateAccountUseCase:
    def __init__(self, repo: AccountRepository):
        self.repo = repo

    def execute(self, data: dict) -> AccountEntity:
        return self.repo.create_account(data=data)


class GetAccountByIdUseCase:
    def __init__(self, repo: AccountRepository):
        self.repo = repo

    def execute(self, id: int) -> AccountEntity:
        return self.repo.get_account_by_id(id=id)


class UpdateAccountUseCase:
    def __init__(self, repo: AccountRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> AccountEntity:
        return self.repo.update_account(id=id, data=data)


class DeleteAccountUseCase:
    def __init__(self, repo: AccountRepository):
        self.repo = repo

    def execute(self, id: int) -> AccountEntity:
        return self.repo.delete_account(id=id)


class ListAccountsUseCase:
    def __init__(self, repo: AccountRepository):
        self.repo = repo

    def execute(self, search_params: dict):
        return self.repo.list_accounts(search_params=search_params)