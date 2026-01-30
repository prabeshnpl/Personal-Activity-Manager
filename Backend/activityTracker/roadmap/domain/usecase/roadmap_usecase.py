from typing import List
from roadmap.domain.entity.roadmap_entity import RoadmapEntity
from roadmap.domain.repository.roadmap_repo import RoadmapRepository


class CreateRoadmapUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, data: dict) -> RoadmapEntity:
        return self.repo.create_roadmap(data=data)


class GetRoadmapByIdUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, id: int) -> RoadmapEntity:
        return self.repo.get_roadmap_by_id(id=id)


class UpdateRoadmapUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, id: int, data: dict) -> RoadmapEntity:
        return self.repo.update_roadmap(id=id, data=data)


class DeleteRoadmapUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, id: int) -> RoadmapEntity:
        return self.repo.delete_roadmap(id=id)


class ListRoadmapsUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, search_params: dict) -> List[RoadmapEntity]:
        return self.repo.list_roadmaps(search_params=search_params)