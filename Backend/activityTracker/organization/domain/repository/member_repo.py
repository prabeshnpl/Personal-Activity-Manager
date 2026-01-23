from abc import ABC, abstractmethod
from typing import List
from organization.domain.entity.member_entity import MemberEntity

class MemberRepository(ABC):

    @abstractmethod
    def create_member(self, data: dict) -> MemberEntity:
        pass

    @abstractmethod
    def get_member_by_id(self, id: int) -> MemberEntity:
        pass

    @abstractmethod
    def update_member(self, id: int, data: dict) -> MemberEntity:
        pass

    @abstractmethod
    def delete_member(self, id: int) -> MemberEntity:
        pass

    @abstractmethod
    def list_members(self, search_params: dict) -> List[MemberEntity]:
        pass
