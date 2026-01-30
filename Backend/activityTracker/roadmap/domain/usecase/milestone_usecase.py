from typing import List
from roadmap.domain.entity.milestone_entity import MilestoneEntity
from roadmap.domain.repository.milestone_repo import MilestoneRepository


class CreateMilestoneUseCase:
    def __init__(self, repo: MilestoneRepository):
        self.repo = repo

    def execute(self, data: dict) -> MilestoneEntity:
        return self.repo.create_milestone(data=data)


class GetMilestoneByIdUseCase:
    def __init__(self, repo: MilestoneRepository):
        self.repo = repo

    def execute(self, id: int) -> MilestoneEntity:
        return self.repo.get_milestone_by_id(id=id)


class UpdateMilestoneUseCase:
    def __init__(self, repo: MilestoneRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> MilestoneEntity:
        return self.repo.update_milestone(id=id, data=data)


class DeleteMilestoneUseCase:
    def __init__(self, repo: MilestoneRepository):
        self.repo = repo

    def execute(self, id: int) -> MilestoneEntity:
        return self.repo.delete_milestone(id=id)


class ListMilestonesUseCase:
    def __init__(self, repo: MilestoneRepository):
        self.repo = repo

    def execute(self, search_params: dict) -> List[MilestoneEntity]:
        return self.repo.list_milestones(search_params=search_params)