from abc import ABC, abstractmethod
from user.domain.entity.token_entity import TokenEntity
from user.models import CustomUser
from user.domain.entity.user_entity import CustomUserEntity

class CustomUserRepository(ABC):

    @abstractmethod
    def create_user(self, data: dict) -> TokenEntity:
        pass

    @abstractmethod
    def get_user_by_id(self, id:int) -> CustomUserEntity:
        pass

    @abstractmethod 
    def delete_user(self, id:int) -> CustomUserEntity:
        pass

    @abstractmethod 
    def update_user(self, id:int, data:dict) -> CustomUserEntity:
        pass

    @abstractmethod 
    def list_user(self, search_params:dict) -> CustomUserEntity:
        pass



    

