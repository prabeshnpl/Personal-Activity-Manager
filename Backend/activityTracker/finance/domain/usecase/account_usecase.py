from typing import List
from finance.domain.entity.account_entity import AccountEntity
from finance.domain.repository.account_repo import AccountRepository
from rest_framework.response import Response

class CreateAccountUseCase:
    def __init__(self, repo: AccountRepository):
        self.repo = repo

    def execute(self, data: dict, organization:int, role:str) -> AccountEntity| Response:
        return self.repo.create_account(data=data, organization=organization, role=role)


class GetAccountByIdUseCase:
    def __init__(self, repo: AccountRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> AccountEntity| Response:
        return self.repo.get_account_by_id(id=id, organization=organization, role=role)


class UpdateAccountUseCase:
    def __init__(self, repo: AccountRepository):
        self.repo = repo

    def execute(self, id: int, data: dict, organization:int, role:str) -> AccountEntity| Response:
        return self.repo.update_account(id=id, data=data, organization=organization,role=role)


class DeleteAccountUseCase:
    def __init__(self, repo: AccountRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> Response:
        return self.repo.delete_account(id=id, organization=organization,role=role)


class ListAccountsUseCase:
    def __init__(self, repo: AccountRepository):
        self.repo = repo

    def execute(self, search_params: dict, organization:int, role:str) -> List[AccountEntity]| Response:
        return self.repo.list_accounts(search_params=search_params, organization=organization,role=role)