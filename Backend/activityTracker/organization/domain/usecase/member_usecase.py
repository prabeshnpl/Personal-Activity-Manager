from typing import List
from organization.domain.entity.member_entity import MemberEntity
from organization.domain.repository.member_repo import MemberRepository
from rest_framework.response import Response

class CreateMemberUseCase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, data: dict, organization:int, role:str) -> MemberEntity | Response:
        return self.repo.create_member(data=data, organization=organization, role=role)


class GetMemberByIdUseCase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> MemberEntity | Response:
        return self.repo.get_member_by_id(id=id, organization=organization, role=role)


class UpdateMemberUseCase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, id: int, data: dict, organization:int, role:str) -> MemberEntity | Response:
        return self.repo.update_member(id=id, data=data, organization=organization, role=role)


class DeleteMemberUseCase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> MemberEntity | Response:
        return self.repo.delete_member(id=id, organization=organization, role=role)


class ListMembersUseCase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, search_params: dict, organization:int, role:str) -> List[MemberEntity] | Response:
        return self.repo.list_members(search_params=search_params, organization=organization, role=role)
    
class MemberBreakdownUsecase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, search_params: dict, organization:int, role:str) -> List[MemberEntity] | Response:
        return self.repo.breakdown_members(search_params=search_params, organization=organization, role=role)

