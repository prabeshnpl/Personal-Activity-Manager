from typing import Optional
from user.domain.entity.user_entity import CustomUserEntity
from user.domain.repository.user_repo import CustomUserRepository
from user.domain.entity.token_entity import TokenEntity
from rest_framework.response import Response

class CreateCustomUserUseCase:
    def __init__(self, repo: CustomUserRepository):
        self.repo = repo

    def execute(self, data:dict) -> Optional[TokenEntity] | Optional[Response]:
        return self.repo.create_user(data=data)

class GetCustomUserByIdUsecase:
    def __init__(self, repo: CustomUserRepository):
        self.repo = repo  

    def execute(self, id:int) -> Optional[CustomUserEntity] | Optional[Response]:
        return self.repo.get_user_by_id(id=id)    

class UpdateCustomUserUsecase:
    def __init__(self, repo: CustomUserRepository):
        self.repo = repo  

    def execute(self, id:int, data:dict) -> Optional[CustomUserEntity] | Optional[Response]:
        return self.repo.update_user(id=id, data=data)    
    
class DeleteCustomUserUsecase:
    def __init__(self, repo: CustomUserRepository):
        self.repo = repo  

    def execute(self, id:int):
        return self.repo.delete_user(id=id)

class ListCustomUserUsecase:
    def __init__(self, repo: CustomUserRepository):
        self.repo = repo  

    def execute(self, search_params:dict):
        return self.repo.list_user(search_params=search_params)
        