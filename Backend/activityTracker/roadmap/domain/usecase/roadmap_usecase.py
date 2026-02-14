from typing import List
from roadmap.domain.entity.roadmap_entity import RoadmapEntity
from roadmap.domain.repository.roadmap_repo import RoadmapRepository
from rest_framework.response import Response

class CreateRoadmapUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, data: dict, organization:int, role:str) -> RoadmapEntity | Response:
        return self.repo.create_roadmap(data=data, organization=organization, role=role)


class GetRoadmapByIdUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> RoadmapEntity | Response:
        return self.repo.get_roadmap_by_id(id=id, organization=organization, role=role)


class UpdateRoadmapUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, id: int, data: dict, organization:int, role:str) -> RoadmapEntity | Response:
        return self.repo.update_roadmap(id=id, data=data, organization=organization, role=role)


class DeleteRoadmapUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> RoadmapEntity | Response:
        return self.repo.delete_roadmap(id=id, organization=organization, role=role)


class ListRoadmapsUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, search_params: dict, organization:int, role:str) -> List[RoadmapEntity] | Response:
        return self.repo.list_roadmaps(search_params=search_params, organization=organization, role=role)

class RoadmapProgressUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> Response:
        return self.repo.roadmap_progress(id=id, organization=organization, role=role)

class RoadmapStatsUseCase:
    def __init__(self, repo: RoadmapRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> Response:
        return self.repo.roadmap_stats(id=id, organization=organization, role=role)