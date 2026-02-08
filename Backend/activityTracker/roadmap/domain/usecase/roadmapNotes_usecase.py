from typing import List
from roadmap.domain.entity.roadmapNotes_entity import RoadmapNotesEntity
from roadmap.domain.repository.roadmapNotes_repo import RoadmapNotesRepository
from rest_framework.response import Response

class CreateRoadmapNotesUseCase:
    def __init__(self, repo: RoadmapNotesRepository):
        self.repo = repo

    def execute(self, data: dict, organization:int, role:str) -> RoadmapNotesEntity | Response:
        return self.repo.create_roadmap_notes(data=data, organization=organization, role=role)


class GetRoadmapNotesByIdUseCase:
    def __init__(self, repo: RoadmapNotesRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> RoadmapNotesEntity | Response:
        return self.repo.get_roadmap_notes_by_id(id=id, organization=organization, role=role)


class UpdateRoadmapNotesUseCase:
    def __init__(self, repo: RoadmapNotesRepository):
        self.repo = repo

    def execute(self, id: int, data: dict, organization:int, role:str) -> RoadmapNotesEntity | Response:
        return self.repo.update_roadmap_notes(id=id, data=data, organization=organization, role=role)


class DeleteRoadmapNotesUseCase:
    def __init__(self, repo: RoadmapNotesRepository):
        self.repo = repo

    def execute(self, id: int, organization:int, role:str) -> RoadmapNotesEntity | Response:
        return self.repo.delete_roadmap_notes(id=id, organization=organization, role=role)


class ListRoadmapsNotesUseCase:
    def __init__(self, repo: RoadmapNotesRepository):
        self.repo = repo

    def execute(self, search_params: dict, organization:int, role:str) -> List[RoadmapNotesEntity] | Response:
        return self.repo.list_roadmaps_notes(search_params=search_params, organization=organization, role=role)