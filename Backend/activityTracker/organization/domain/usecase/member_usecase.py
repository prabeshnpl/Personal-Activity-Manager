from organization.domain.entity.member_entity import MemberEntity
from organization.domain.repository.member_repo import MemberRepository


class CreateMemberUseCase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, data: dict) -> MemberEntity:
        return self.repo.create_member(data=data)


class GetMemberByIdUseCase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, id: int) -> MemberEntity:
        return self.repo.get_member_by_id(id=id)


class UpdateMemberUseCase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> MemberEntity:
        return self.repo.update_member(id=id, data=data)


class DeleteMemberUseCase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, id: int) -> MemberEntity:
        return self.repo.delete_member(id=id)


class ListMembersUseCase:
    def __init__(self, repo: MemberRepository):
        self.repo = repo

    def execute(self, search_params: dict):
        return self.repo.list_members(search_params=search_params)