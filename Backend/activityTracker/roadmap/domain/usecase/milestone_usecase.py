from typing import List
from roadmap.domain.entity.milestone_entity import MilestoneEntity
from roadmap.domain.repository.milestone_repo import MilestoneRepository
from rest_framework.response import Response

class CreateMilestoneUseCase:
    def __init__(self, repo: MilestoneRepository):
        self.repo = repo

    def execute(self, data: dict, organization:int, role:str) -> MilestoneEntity | Response:
        return self.repo.create_milestone(data=data, organization=organization, role=role)


class GetMilestoneByIdUseCase:
    def __init__(self, repo: MilestoneRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> MilestoneEntity | Response:
        return self.repo.get_milestone_by_id(id=id, organization=organization, role=role)


class UpdateMilestoneUseCase:
    def __init__(self, repo: MilestoneRepository):
        self.repo = repo

    def execute(self, id: int, data: dict, organization:int, role:str) -> MilestoneEntity | Response:
        return self.repo.update_milestone(id=id, data=data, organization=organization, role=role)


class DeleteMilestoneUseCase:
    def __init__(self, repo: MilestoneRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> MilestoneEntity | Response:
        return self.repo.delete_milestone(id=id, organization=organization, role=role)


class ListMilestonesUseCase:
    def __init__(self, repo: MilestoneRepository):
        self.repo = repo

    def execute(self, search_params: dict, organization:int, role:str) -> List[MilestoneEntity] | Response:
        return self.repo.list_milestones(search_params=search_params, organization=organization, role=role)