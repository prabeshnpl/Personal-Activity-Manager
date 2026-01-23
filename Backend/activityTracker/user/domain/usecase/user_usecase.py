from user.domain.entity.user_entity import CustomUserEntity
from user.domain.repository.user_repo import CustomUserRepository
from user.domain.entity.token_entity import TokenEntity
from user.models import CustomUser

class CreateCustomUserUseCase:
    def __init__(self, repo: CustomUserRepository):
        self.repo = repo

    def execute(self, data:dict) -> TokenEntity:
        return self.repo.create_user(data=data)

class GetCustomUserByIdUsecase:
    def __init__(self, repo: CustomUserRepository):
        self.repo = repo  

    def execute(self, id:int) -> CustomUserEntity:
        return self.repo.get_user_by_id(id=id)    

class UpdateCustomUserUsecase:
    def __init__(self, repo: CustomUserRepository):
        self.repo = repo  

    def execute(self, id:int, data:dict) -> CustomUserEntity:
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
        