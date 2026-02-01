from abc import ABC, abstractmethod
from typing import List, Optional
from user.domain.entity.token_entity import TokenEntity
from user.domain.entity.user_entity import CustomUserEntity
from rest_framework.response import Response

class CustomUserRepository(ABC):

    @abstractmethod
    def create_user(self, data: dict) -> Optional[TokenEntity] | Optional[Response]:
        pass

    @abstractmethod
    def get_user_by_id(self, id:int, organization:int, role:str) -> Optional[CustomUserEntity] | Optional[Response]:
        pass

    @abstractmethod 
    def delete_user(self, id:int, organization:int, role:str) -> None | Optional[Response]:
        pass

    @abstractmethod 
    def update_user(self, id:int, data:dict, organization:int, role:str) -> Optional[CustomUserEntity] | Optional[Response]:
        pass

    @abstractmethod 
    def list_user(self, organization:int, role:str, search_params:Optional[dict]=None) -> Optional[List[CustomUserEntity]] | Optional[Response]:
        pass



    

