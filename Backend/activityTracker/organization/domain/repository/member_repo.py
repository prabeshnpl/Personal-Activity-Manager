from abc import ABC, abstractmethod
from typing import List
from organization.domain.entity.member_entity import MemberEntity
from rest_framework.response import Response

class MemberRepository(ABC):

    @abstractmethod
    def create_member(self, data: dict) -> MemberEntity | Response:
        pass

    @abstractmethod
    def get_member_by_id(self, id: int) -> MemberEntity | Response:
        pass

    @abstractmethod
    def update_member(self, id: int, data: dict) -> MemberEntity | Response:
        pass

    @abstractmethod
    def delete_member(self, id: int) -> MemberEntity | Response:
        pass

    @abstractmethod
    def list_members(self, search_params: dict) -> List[MemberEntity] | Response:
        pass
