from abc import ABC, abstractmethod
from typing import List
from organization.domain.entity.member_entity import MemberEntity
from rest_framework.response import Response

class MemberRepository(ABC):

    @abstractmethod
    def create_member(self, data: dict, organization:int, role:str) -> MemberEntity | Response:
        pass

    @abstractmethod
    def get_member_by_id(self, id: int, organization:int, role:str) -> MemberEntity | Response:
        pass

    @abstractmethod
    def update_member(self, id: int, data: dict, organization:int, role:str) -> MemberEntity | Response:
        pass

    @abstractmethod
    def delete_member(self, id: int, organization:int, role:str) -> MemberEntity | Response:
        pass

    @abstractmethod
    def list_members(self, search_params: dict, organization:int, role:str) -> List[MemberEntity] | Response:
        pass
        
    @abstractmethod
    def breakdown_members(self, search_params: dict, organization:int, role:str) -> List[MemberEntity] | Response:
        pass

